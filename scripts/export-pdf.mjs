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

async function exportPdf() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Starting dev server for PDF export...');
  const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle' });

  const pdfPath = path.join(OUT_DIR, `resume-${lang}-${template}.pdf`);
  console.log(`Exporting PDF to ${pdfPath}...`);
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
  });

  console.log('PDF export complete.');
  await browser.close();
  server.kill();
  process.exit(0);
}

exportPdf().catch(err => {
  console.error(err);
  process.exit(1);
});
