#!/usr/bin/env node
import { Command } from "commander";
import uploader from "./tools/Uploader";
import authenticator from "./tools/Authenticator";
import config from "./tools/Config";
import pack from "./tools/Pack";
import launcher from "./tools/Launcher";
import ssh from "./tools/SSH";
import runScript from "./tools/RunScript";
import developer from "./tools/Developer";
import runCommand from "./tools/RunCommand";
import ftpUpload from "./tools/FtpUpload";
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

program
  .command("config")
  .description("make app config")
  .action(() => {
    config.make();
  });

program
  .command("pack")
  .description("pack app")
  .action(() => {
    pack.make();
  });

program
  .command("develope")
  .description("Develop app")
  .action(() => {
    launcher.develope();
  });

program
  .command("ssh-uploadDir")
  .description("Upload using ssh")
  .action(() => {
    ssh.uploadDir();
  });

program
  .command("run-script")
  .description("Run script")
  .argument("<script>", "Name of the script to run") // Define the argument
  .action(() => {
    runScript.run();
  });

program
  .command("makeAppId")
  .description("Make app id")
  .action(() => {
    developer.makeAppId();
  });

program
  .command("makeAppToken")
  .description("Make app token")
  .action(() => {
    developer.makeAppToken();
  });

program
  .command("run-command")
  .description("Run a shell command with path replacements")
  .argument("<command...>", "Command to run") // Use ... to capture all arguments
  .action((args) => {
    // Join all arguments back into a single command string
    const command = args.join(" ");
    runCommand.run(command);
  });

program
  .command("ftp-upload")
  .description("Upload a file to FTP server")
  .requiredOption("--host <host>", "FTP server host")
  .requiredOption("--user <username>", "FTP username")
  .requiredOption("--password <password>", "FTP password")
  .requiredOption("--local-file <file>", "Local file to upload")
  .requiredOption("--ftp-dir <directory>", "FTP server directory")
  .option("--remote-name <name>", "Optional custom name for the uploaded file")
  .action(async (options) => {
    try {
      await ftpUpload.upload({
        host: options.host,
        user: options.user,
        password: options.password,
        localFile: options.localFile,
        ftpDir: options.ftpDir,
        remoteName: options.remoteName
      });
    } catch (error) {
      console.error("FTP upload failed");
      process.exit(1);
    }
  });

program.parse(process.argv);
