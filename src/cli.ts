#!/usr/bin/env node
import { Command } from "commander";
import uploader from "./tools/Uploader";
const program = new Command();

program.name("soft-knife").description("A collection of precision tools for software development.").version("0.0.0");

// Add commands for each tool
program
  .command("upload")
  .description("Upload zip file")
  .action(() => {
    uploader.upload();
  });

program
  .command("login")
  .description("Login to GADA server")
  .action(() => {
    uploader.upload();
  });

program.parse(process.argv);
