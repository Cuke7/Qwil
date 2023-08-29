import { marked } from "marked";
import fs from "fs";
import puppeteer from "puppeteer";

marked.use({
  gfm: true,
  breaks: true,
});

const md = fs.readFileSync("./test.md", { encoding: "utf8", flag: "r" });

const body = marked.parse(md);

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/gh/aaaakshat/cm-web-fonts@latest/fonts.css" rel="stylesheet">
</head>
<body>
    ${body}
</body>
</html>
`;

fs.writeFileSync("output.html", html);

const browser = await puppeteer.launch({
  headless: false,
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

await page.setContent(html, { waitUntil: "domcontentloaded" });
await page.addStyleTag({ path: "./styles.css" });

await page.pdf({
  path: "result.pdf",
  margin: { top: "50px", right: "100px", bottom: "50px", left: "100px" },
  printBackground: true,
  format: "A4",
});

// await browser.close();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
