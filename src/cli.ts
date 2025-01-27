#!/usr/bin/env node
import { Command } from "commander";
import uploader from "./tools/Uploader";
import authenticator from "./tools/Login";
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
  .command("access")
  .description("access to GADA server")
  .action(() => {
    authenticator.access();
  });

program
  .command("login")
  .description("Login to GADA server")
  .action(() => {
    authenticator.login();
  });

program.parse(process.argv);
