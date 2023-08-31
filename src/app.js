import { marked } from "marked";
import { readFileSync, writeFileSync } from "fs";
import puppeteer from "puppeteer";
import markedKatex from "marked-katex-extension";
import fm from "front-matter";

marked.use({
  gfm: true,
  breaks: true,
});

marked.use(
  markedKatex({
    throwOnError: true,
  })
);

// Read the md file
let md = readFileSync("./src/test.md", {
  encoding: "utf8",
  flag: "r",
});

// Declare and apply custom commands
const custom_commands = [
  {
    name: "image",
    regex: /!\[(.*)\]\((.*)\){(.*)}/gm,
    replaceFunction: (md, regex) => {
      return md.replace(regex, (match, caption, url, style) => {
        return `<div style="display: flex; flex-direction: column; align-items: center;"><img src="${url}" style="${style}" /><span style="margin: 20px; 0px">${caption}</span></div>`;
      });
    },
  },
];

function apply_commands(md) {
  let out = md;
  for (const command of custom_commands) {
    out = command.replaceFunction(md, command.regex);
  }
  return out;
}

// Front-matter parsing

var content = fm(md);

const medaData = content.attributes;

let header = "";

if (medaData.author) {
  header += `<div style="text-align: center">
<span style="font-size: 34px"> ${medaData.author} </span>
</div>`;
}

if (medaData.date) {
  header += `<div style="text-align: center">
  <span> ${medaData.date} </span>
  </div>`;
}

const fullMD = `
${header}

${content.body.trim()}
`;

// Parse the md into an HTML body
const body = marked.parse(apply_commands(fullMD).trim());

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/gh/aaaakshat/cm-web-fonts@latest/fonts.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">
</head>
<body>
    ${body}
</body>
</html>
`;

// Write the HTML file for debugging purpose
writeFileSync("./src/output.html", html);

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
await page.goto(`file://${process.cwd()}/src/output.html`);
await page.addStyleTag({ path: "./src/styles.css" });
await page.waitForFunction("document.fonts.ready");
await page.emulateMediaType("print");

await page.pdf({
  path: "./src/result.pdf",
  // margin: { top: "50px", right: "100px", bottom: "50px", left: "100px" },
  printBackground: true,
  format: "A4",
});

// await browser.close();

// time is in ms
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
