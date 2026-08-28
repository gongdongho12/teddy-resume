import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const PORT = 4321;
const OUT_DIR = path.resolve('dist');

const lang = process.argv[2] || 'ko';
const template = process.argv[3] || 'default';
const basePath = (process.env.BASE_URL || '/').replace(/\/$/, '');

const routePath = template === 'default' ? `/${lang}/` : `/${lang}/${template}/`;
const URL = `http://localhost:${PORT}${basePath}${routePath}`;

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (error) {
    if (!String(error).includes("Executable doesn't exist")) throw error;
    return chromium.launch({ channel: 'chrome' });
  }
}

async function exportPdf() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Starting dev server for PDF export...');
  const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
  let browser;

  try {
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Launching browser...');
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.emulateMedia({ media: 'print' });

    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForFunction(
      () => document.documentElement.dataset.a4PaginationReady === 'true',
      null,
      { timeout: 20000 },
    );
    await page.evaluate(() => document.fonts.ready);

    const pdfPath = path.join(OUT_DIR, `resume-${lang}-${template}.pdf`);
    console.log(`Exporting PDF to ${pdfPath}...`);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    console.log('PDF export complete.');
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
}

exportPdf().catch(err => {
  console.error(err);
  process.exit(1);
});
