import puppeteer from "puppeteer";

export default async function build_pdf(html) {
  // PDF generation
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  // await page.addStyleTag({ path: "./font/Bright/cmun-bright.css" });
  // await page.addStyleTag({ path: "./font/Bright Semibold/cmun-bright-semibold.css" });
  // await page.addStyleTag({ path: "./font/Classical Serif Italic/cmun-classical-serif-italic.css" });
  // await page.addStyleTag({ path: "./font/Concrete/cmun-concrete.css" });
  // await page.addStyleTag({ path: "./font/Sans/cmun-sans.css" });
  // await page.addStyleTag({ path: "./font/Sans Demi-Condensed/cmun-sans-demicondensed.css" });
  // await page.addStyleTag({ path: "./font/Serif/cmun-serif.css" });
  // await page.addStyleTag({ path: "./font/Serif Slanted/cmun-serif-slanted.css" });
  // await page.addStyleTag({ path: "./font/Typewriter/cmun-typewriter.css" });
  // await page.addStyleTag({ path: "./font/Typewriter Light/cmun-typewriter-light.css" });
  // await page.addStyleTag({ path: "./font/Typewriter Variable/cmun-typewriter-variable.css" });
  // await page.addStyleTag({ path: "./font/Upright Italic/cmun-upright-italic.css" });
  // await page.addStyleTag({ url: "https://cdn.jsdelivr.net/gh/aaaakshat/cm-web-fonts@latest/fonts.css" });

  // await page.evaluate((html) => {
  //   document.body.innerHTML = html;
  // }, html);

  // await page.setContent(html, { waitUntil: "networkidle0" });
  await page.goto(`file://${process.cwd()}/test/output.html`);
  await page.addStyleTag({ path: "./test/styles.css" });
  await page.waitForFunction("document.fonts.ready");
  await page.emulateMediaType("print");

  await page.pdf({
    path: "./test/result.pdf",
    printBackground: true,
    format: "A4",
  });

  await browser.close();
}
