#!/usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import kleur from "kleur";

interface AppPaths {
  [key: string]: string;
}

class RunCommand {
  async run(command: string) {
    // Try to read `app_paths.json` for path replacements
    const appPathsPath = path.resolve(process.cwd(), "app_paths.json");
    let appPaths: AppPaths = {};
    if (fs.existsSync(appPathsPath)) {
      appPaths = JSON.parse(fs.readFileSync(appPathsPath, "utf-8"));
      console.log(kleur.cyan(`Loaded app_paths.json with ${Object.keys(appPaths).length} entries.`));
    }

    // Replace placeholders in the command using `app_paths.json` (if available)
    let modifiedCommand = command;
    Object.keys(appPaths).forEach((placeholder) => {
      const value = appPaths[placeholder];
      modifiedCommand = modifiedCommand.replace(new RegExp(placeholder, "g"), value);
    });

    console.log(kleur.bold(kleur.green(`Running command:`)), kleur.yellow(modifiedCommand));

    // Execute the command
    const childProcess = exec(modifiedCommand);

    // Print all `stdout` and `stderr` data
    childProcess.stdout?.on("data", (data) => {
      console.log(kleur.green(`[stdout]:`), data.trim());
    });

    childProcess.stderr?.on("data", (data) => {
      console.error(kleur.red(`[stderr]:`), data.trim());
    });

    // Handle process exit
    childProcess.on("close", (code) => {
      if (code === 0) {
        console.log(kleur.bold(kleur.green(`Process exited successfully with code: ${code}`)));
      } else {
        console.log(kleur.bold(kleur.red(`Process exited with error code: ${code}`)));
      }
    });
  }
}

const runCommand = new RunCommand();
export default runCommand; 