#! /usr/bin/env node
import { writeFileSync } from "fs";
import build_pdf from "./build_pdf.js";
import build_md from "./build_md.js";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";

const optionDefinitions = [
  {
    name: "file",
    alias: "f",
    type: String,
    description: "Mardown file to convert to pdf.",
  },
  {
    name: "destination",
    alias: "d",
    type: String,
    description: "Generated html/pdf file name.",
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this help.",
  },
];

const sections = [
  {
    header: chalk.cyan("{underline QWIL}"),
    content: `CLI tool to convert md file to latext style pdfs.`,
  },
  {
    header: chalk.cyan("{underline OPTIONS}"),
    optionList: optionDefinitions,
  },
  {
    header: chalk.cyan("{underline EXEMPLE}"),
    content: "qwil -f ./file.md -d ./file.pdf",
  },
];

const options = commandLineArgs(optionDefinitions);
const help = commandLineUsage(sections);

if (options.help) {
  console.log(help);
  process.exit();
}

if (!options.file) {
  console.error(chalk.red("Missing path argument. USAGE: qwil -f <FILENAME> -d <DESTINATION>"));
  process.exit();
}

if (!options.destination) {
  console.error(chalk.red("Missing destiation argument. USAGE: qwil -f <FILENAME> -d <DESTINATION>"));
  process.exit();
}

const html = await build_md(options.file);

build_pdf(html, options.destination);
