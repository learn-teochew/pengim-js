#!/usr/bin/env node

import commander from "commander";
import fs from "fs";
import readline from "readline";
import { convertLine } from "./src/pengim.js";

commander
  .version("1.0.0", "-v, --version")
  .description("Convert between Teochew romanization systems")
  .usage("[OPTIONS]...")
  .option("-i, --input <path>", "Path to file containing input text to convert")
  .option(
    "-f, --from <name>",
    "Scheme to convert from: puj, gdpi, ggn, dieghv, fielde",
    "puj",
  )
  .option(
    "-t, --to <name>",
    "Scheme to convert to: puj, gdpi, ggn, dieghv, fielde",
    "gdpi",
  )
  .option(
    "-s, --superscript",
    "Superscript tone numbers (gdpi, ggn, dieghv only)",
  )
  .option("-d, --debug", "Print Syllable object")
  .parse(process.argv);

const options = commander.opts();
const systems = ["puj", "gdpi", "ggn", "dieghv", "fielde"];

// Main ----------------------------------------------------------------------

if (!systems.includes(options.from)) {
  console.error("Unrecognized input format");
  console.error();
  commander.help();
}

if (!systems.includes(options.to)) {
  console.error("Unrecognized output format");
  console.error();
  commander.help();
}

async function processLine(input) {
  try {
    const filestream = fs.createReadStream(input);
    const rl = readline.createInterface({
      input: filestream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      let out = "";
      out = convertLine(
        line,
        options.from,
        options.to,
        options.superscript,
        "[",
        "]",
        options.debug,
      );
      console.log(out);
    }
  } catch (err) {
    console.error("Invalid input or no input file specified");
    console.error();
    commander.help();
  }
}

processLine(options.input);
