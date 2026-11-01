import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import YAML from 'yaml';

// 고정 포트를 쓰면 다른 로컬 서버가 점유했을 때 Astro 가 다음 포트로 비켜 뜨고,
// 스크립트는 점유한 서버에 붙어 404 로 타임아웃된다. 매 실행마다 빈 포트를 잡는다.
let PORT;
let BASE_URL;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}
const OUTPUT_DIR = path.resolve('tmp/pdfs/a4-check');
const DEBUG_GRID = process.argv.includes('--debug-grid');
const A4_WIDTH_PX = (210 * 96) / 25.4;
const A4_HEIGHT_PX = (297 * 96) / 25.4;
const A4_WIDTH_PT = (210 * 72) / 25.4;
const A4_HEIGHT_PT = (297 * 72) / 25.4;
const routes = [
  { lang: 'ko', template: 'default', pathname: '/ko/' },
  { lang: 'en', template: 'default', pathname: '/en/' },
  { lang: 'ko', template: 'creative', pathname: '/ko/creative/' },
  { lang: 'en', template: 'creative', pathname: '/en/creative/' },
];

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServer(server) {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Preview server exited early with code ${server.exitCode}`);
    }
    try {
      const response = await fetch(`${BASE_URL}/ko/`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await wait(250);
  }
  throw new Error(`Preview server did not become ready: ${lastError || 'timeout'}`);
}

function inspectPdf(pdfPath) {
  const output = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' });
  const pageMatch = output.match(/^Pages:\s+(\d+)/m);
  const sizeMatch = output.match(/^Page size:\s+([\d.]+) x ([\d.]+) pts/m);
  if (!pageMatch || !sizeMatch) {
    throw new Error(`Could not parse pdfinfo output for ${pdfPath}`);
  }
  return {
    pages: Number(pageMatch[1]),
    widthPt: Number(sizeMatch[1]),
    heightPt: Number(sizeMatch[2]),
    label: output.match(/^Page size:\s+.+$/m)?.[0] || '',
  };
}

function renderPdf(pdfPath, outputPrefix) {
  execFileSync('pdftoppm', ['-png', '-r', '120', pdfPath, outputPrefix], {
    stdio: 'pipe',
  });
}

function within(actual, expected, tolerance) {
  return Math.abs(actual - expected) <= tolerance;
}

async function validateResumeSource() {
  const sourcePath = path.resolve('src/content/resume/profile.yaml');
  const profile = YAML.parse(await readFile(sourcePath, 'utf8'));
  const issues = [];

  for (const [sectionIndex, section] of (profile.projectSections || []).entries()) {
    for (const [projectIndex, project] of (section.projects || []).entries()) {
      for (const field of ['highlights', 'results']) {
        for (const lang of ['ko', 'en']) {
          for (const [itemIndex, item] of (project[field]?.[lang] || []).entries()) {
            if (typeof item !== 'string') {
              issues.push(
                `projectSections[${sectionIndex}].projects[${projectIndex}].${field}.${lang}[${itemIndex}] must be a string`,
              );
            }
          }
        }
      }
    }
  }

  // 포트폴리오 페이지 정렬 목록에서 빠진 slug 는 페이지 맨 뒤로 밀린다.
  // 이력서의 portfolioSlug 가 포트폴리오에 없으면 링크가 깨진다.
  const portfolioSource = await readFile(path.resolve('src/lib/portfolio-content.ts'), 'utf8');
  const portfolioSlugs = [...portfolioSource.matchAll(/^ {6}slug: '([^']+)'/gm)].map((m) => m[1]);
  for (const page of ['src/pages/portfolio/[lang]/index.astro', 'src/pages/[lang]/portfolio.astro']) {
    const block = (await readFile(path.resolve(page), 'utf8')).match(/orderedSlugs = \[([\s\S]*?)\]/);
    if (!block) {
      issues.push(`${page}: orderedSlugs not found`);
      continue;
    }
    const ordered = [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    portfolioSlugs
      .filter((slug) => !ordered.includes(slug))
      .forEach((slug) => issues.push(`${page}: portfolio slug '${slug}' missing from orderedSlugs`));
  }
  for (const section of profile.projectSections || []) {
    for (const project of section.projects || []) {
      if (project.portfolioSlug && !portfolioSlugs.includes(project.portfolioSlug)) {
        issues.push(`profile.yaml portfolioSlug '${project.portfolioSlug}' has no portfolio project`);
      }
    }
  }

  return { sourcePath, issues };
}

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (error) {
    if (!String(error).includes("Executable doesn't exist")) throw error;
    return chromium.launch({ channel: 'chrome' });
  }
}

async function verifyRoute(browser, route) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  const query = DEBUG_GRID ? '?a4-debug=1' : '';
  const url = `${BASE_URL}${route.pathname}${query}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => document.documentElement.dataset.a4PaginationReady === 'true',
    null,
    { timeout: 20_000 },
  );
  await page.evaluate(() => document.fonts.ready);
  const screenPageCount = await page.locator('.a4-page').count();

  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await page.waitForFunction(
    () => document.documentElement.dataset.a4PaginationReady === 'true',
    null,
    { timeout: 20_000 },
  );

  const dom = await page.evaluate(
    ({ expectedWidth, expectedHeight }) => {
      const tolerance = 2;
      const pages = Array.from(document.querySelectorAll('.a4-page')).map((element, index) => {
        const page = element;
        const rect = page.getBoundingClientRect();
        const overflowX = page.scrollWidth > page.clientWidth + 1;
        const overflowY = page.scrollHeight > page.clientHeight + 1;
        const content = page.querySelector('[data-a4-page-content="true"]');
        const printableChildren = content
          ? Array.from(content.children).filter((child) => !child.classList.contains('print-spacer'))
          : [];
        return {
          index: index + 1,
          id: page.dataset.a4Page || `page-${index + 1}`,
          widthPx: rect.width,
          heightPx: rect.height,
          scrollWidth: page.scrollWidth,
          clientWidth: page.clientWidth,
          scrollHeight: page.scrollHeight,
          clientHeight: page.clientHeight,
          validA4Size:
            Math.abs(rect.width - expectedWidth) <= tolerance &&
            Math.abs(rect.height - expectedHeight) <= tolerance,
          overflowX,
          overflowY,
          printableChildCount: printableChildren.length,
          orphanHeading:
            printableChildren.length > 0 &&
            printableChildren.at(-1)?.tagName === 'H2',
        };
      });

      const clippedElements = Array.from(document.querySelectorAll('*'))
        .filter((element) => {
          if (!(element instanceof HTMLElement)) return false;
          const style = getComputedStyle(element);
          const clipsX = ['hidden', 'clip'].includes(style.overflowX);
          const clipsY = ['hidden', 'clip'].includes(style.overflowY);
          return (
            (clipsX && element.scrollWidth > element.clientWidth + 1) ||
            (clipsY && element.scrollHeight > element.clientHeight + 1)
          );
        })
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === 'string' ? element.className : '',
          a4Page: element.dataset.a4Page || '',
          dimensions: `${element.clientWidth}x${element.clientHeight} -> ${element.scrollWidth}x${element.scrollHeight}`,
        }))
        .slice(0, 20);

      return {
        ready: document.documentElement.dataset.a4PaginationReady,
        reportedOversizeCount: Number(document.documentElement.dataset.a4OversizeCount || 0),
        reportedOverflowCount: Number(document.documentElement.dataset.a4OverflowCount || 0),
        oversizeItems: Array.from(document.querySelectorAll('[data-a4-oversize="true"]')).map(
          (element) => element.textContent?.trim().slice(0, 120) || element.tagName,
        ),
        unexpectedTokens: ['[object Object]', '[object Promise]', 'undefined']
          .filter((token) => document.body.innerText.includes(token)),
        pages,
        clippedElements,
      };
    },
    { expectedWidth: A4_WIDTH_PX, expectedHeight: A4_HEIGHT_PX },
  );

  const suffix = DEBUG_GRID ? '-debug' : '';
  const basename = `resume-${route.lang}-${route.template}${suffix}`;
  const pdfPath = path.join(OUTPUT_DIR, `${basename}.pdf`);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await page.close();

  const pdf = inspectPdf(pdfPath);
  renderPdf(pdfPath, path.join(OUTPUT_DIR, basename));

  const failures = [];
  if (browserErrors.length > 0) failures.push(`browser errors: ${browserErrors.join(' | ')}`);
  if (dom.pages.length === 0) failures.push('no .a4-page elements found');
  if (dom.pages.some((item) => !item.validA4Size)) failures.push('one or more DOM pages are not 210mm × 297mm');
  if (dom.pages.some((item) => item.overflowX || item.overflowY)) failures.push('one or more A4 page boxes overflow');
  if (dom.pages.some((item) => item.printableChildCount === 0 && item.id.startsWith('generated-'))) {
    failures.push('one or more generated pages are blank');
  }
  if (dom.pages.some((item) => item.orphanHeading)) {
    failures.push('one or more section headings are orphaned at a page boundary');
  }
  if (dom.reportedOversizeCount > 0) failures.push(`${dom.reportedOversizeCount} pagination item(s) exceed one page`);
  if (dom.unexpectedTokens.length > 0) failures.push(`rendered placeholder tokens: ${dom.unexpectedTokens.join(', ')}`);
  if (dom.clippedElements.length > 0) failures.push(`${dom.clippedElements.length} element(s) would be clipped by overflow rules`);
  if (pdf.pages !== dom.pages.length) failures.push(`DOM/PDF page count mismatch: ${dom.pages.length}/${pdf.pages}`);
  if (!within(pdf.widthPt, A4_WIDTH_PT, 0.5) || !within(pdf.heightPt, A4_HEIGHT_PT, 0.5)) {
    failures.push(`PDF size is ${pdf.widthPt} × ${pdf.heightPt} pt, expected A4`);
  }

  return {
    ...route,
    url,
    pdfPath,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
    browserErrors,
    screenPageCount,
    dom,
    pdf,
  };
}

async function main() {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  PORT = await findFreePort();
  BASE_URL = `http://127.0.0.1:${PORT}`;
  const server = spawn(
    'npm',
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PORT)],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let serverOutput = '';
  server.stdout.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });

  let browser;
  const report = {
    generatedAt: new Date().toISOString(),
    debugGrid: DEBUG_GRID,
    outputDirectory: OUTPUT_DIR,
    results: [],
  };

  try {
    report.sourceValidation = await validateResumeSource();
    if (report.sourceValidation.issues.length > 0) {
      throw new Error(`Resume source validation failed: ${report.sourceValidation.issues.join('; ')}`);
    }
    await waitForServer(server);
    browser = await launchBrowser();
    for (const route of routes) {
      const result = await verifyRoute(browser, route);
      report.results.push(result);
      const detail = result.failures.length > 0 ? ` — ${result.failures.join('; ')}` : '';
      console.log(`${result.status} ${route.lang}/${route.template}: ${result.pdf.pages} A4 page(s)${detail}`);
    }
  } catch (error) {
    report.fatalError = error instanceof Error ? error.stack || error.message : String(error);
    report.serverOutput = serverOutput;
    throw error;
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
    await writeFile(path.join(OUTPUT_DIR, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  }

  const failed = report.results.filter((result) => result.status === 'FAIL');
  console.log(`Report: ${path.join(OUTPUT_DIR, 'report.json')}`);
  if (failed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
