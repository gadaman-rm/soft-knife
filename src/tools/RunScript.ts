#!/usr/bin/env node

import { exec } from "child_process";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import kleur from "kleur";

// Define the shape of `package.json` and `app_paths.json`
interface PackageJson {
  scripts: Record<string, string>;
}

interface AppPaths {
  [key: string]: string;
}

class RunScript {
  async run() {
    console.log("Try run");
    // Read and parse `package.json`
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.error(kleur.red("Error: package.json not found."));
      process.exit(1);
    }

    const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    // Try to read `app_paths.json`, but make it optional
    const appPathsPath = path.resolve(process.cwd(), "app_paths.json");
    let appPaths: AppPaths = {};
    if (fs.existsSync(appPathsPath)) {
      appPaths = JSON.parse(fs.readFileSync(appPathsPath, "utf-8"));
      console.log(kleur.cyan(`Loaded app_paths.json with ${Object.keys(appPaths).length} entries.`));
    } else {
      console.log(kleur.yellow("Warning: app_paths.json not found. Proceeding without path replacements."));
    }

    // Ensure there are scripts in `package.json`
    if (!packageJson.scripts || Object.keys(packageJson.scripts).length === 0) {
      console.error(kleur.red("Error: No scripts found in package.json."));
      process.exit(1);
    }

    // Check for a script argument
    const args = process.argv.slice(3);
    const scriptName = args[0];
   
    if (scriptName) {
      // Run the specified script
      if (!(scriptName in packageJson.scripts)) {
        console.error(kleur.red(`Error: Script "${scriptName}" not found in package.json.`));
        process.exit(1);
      }

      const originalScript = packageJson.scripts[scriptName];
      this.runScript(originalScript, appPaths);
    } else {
      // Show interactive list if no script is specified
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "script",
          message: kleur.cyan("Select a script to run:"),
          choices: Object.keys(packageJson.scripts),
        },
      ]);

      const { script } = answers;
      const originalScript = packageJson.scripts[script];
      this.runScript(originalScript, appPaths);
    }
  }

  // Function to run a script with replacements
  runScript(script: string, appPaths: AppPaths) {
    // Replace placeholders in the script using `app_paths.json` (if available)
    let modifiedScript = script;
    Object.keys(appPaths).forEach((placeholder) => {
      const value = appPaths[placeholder];
      modifiedScript = modifiedScript.replace(new RegExp(placeholder, "g"), value);
    });

    console.log(kleur.bold(kleur.green(`Running script:`)), kleur.yellow(modifiedScript));

    // Execute the modified script
    const childProcess = exec(modifiedScript);

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

  //   main().catch((err) => {
  //     console.error(kleur.red(`Error: ${err.message}`));
  //   });
}

const runScript = new RunScript();
export default runScript;
