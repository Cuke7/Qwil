#! /usr/bin/env node
import { writeFileSync } from "fs";

import build_pdf from "./build_pdf.js";
import build_md from "./build_md.js";

const html = await build_md("./test/test.md");

// Write the HTML file for debugging purpose
writeFileSync("./test/output.html", html);

build_pdf(html);
