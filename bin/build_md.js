import { marked } from "marked";
import { readFileSync } from "fs";
import markedKatex from "marked-katex-extension";
import fm from "front-matter";

export default async function (filepath) {
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
  let md = readFileSync(filepath, {
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
  const meta_data = content.attributes;

  const author_header = `
<div style="text-align: center">
  <span style="font-size: 34px"> ${meta_data.author} </span>
</div>`.trim();

  const date_header = `
<div style="text-align: center">
  <span> ${meta_data.date} </span>
</div>`.trim();

  // Parse the md into an HTML body
  const body = marked.parse(apply_commands(content.body).trim());

  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/gh/aaaakshat/cm-web-fonts@latest/fonts.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">
          <style>
          * {
          font-family: "Computer Modern Serif", serif;
            }
            p:has(img) {
              text-align: center;
            }
            img {
              max-width: -webkit-fill-available;
              width: 75%;
            }
            body {
              width: 21cm;
              height: 29.7cm;
              padding: 50px 100px;
            }
            pre{
              background: black;
              color: white;
              padding: 15px;
              border-radius: 5px;
              font-family: monospace;
              width: max-content;
            }
          </style>
          </head>
      <body>
          ${meta_data.author ? author_header : ""}
          ${meta_data.date ? date_header : ""}

          ${body}
      </body>
      </html>
      `;

  return html;
}
