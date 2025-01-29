#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import AdmZip from "adm-zip";
import kleur from "kleur";

interface AppConfig {
  name: string;
  label: string;
}

class Pack {
  checkAppDirectory(directory: string): boolean {
    const appJsonPath = path.join(directory, "app.json");
    if (!fs.existsSync(appJsonPath)) {
      console.error(kleur.red(`Error: app.json not found in ${directory}`));
      return false;
    }

    const appConfig: AppConfig = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
    if (!appConfig.name || !appConfig.label) {
      console.error(kleur.red(`Error: app.json is missing required fields (name or label)`));
      return false;
    }

    const appPath = path.join(directory, "app");
    if (!fs.existsSync(appPath)) {
      console.error(kleur.red(`Error: app directory is missing, Please build project first`));
      return false;
    }

    const iconPath = path.join(directory, `${appConfig.name}.svg`);
    if (!fs.existsSync(iconPath)) {
      console.error(kleur.red(`Error: Icon file ${appConfig.name}.svg not found in ${directory}`));
      return false;
    }

    return true;
  }

  createZip(directory: string): void {
    const appPath = path.join(directory, "app");
    const appJsonPath = path.join(directory, "app.json");
    const appConfig: AppConfig = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
    const iconPath = path.join(directory, `${appConfig.name}.svg`);

    const zip = new AdmZip();
    zip.addLocalFolder(appPath, "app");
    zip.addLocalFile(appJsonPath);
    zip.addLocalFile(iconPath);
    const zipFileName = `${appConfig.name}.app`;
    zip.writeZip(zipFileName);

    console.log(kleur.green(`Success: Created ${zipFileName} in the current directory.`));
  }

  make() {
    const directory = path.resolve(process.cwd());

    if (!fs.existsSync(directory)) {
      console.error(kleur.red(`Error: Directory ${directory} does not exist.`));
      process.exit(1);
    }

    if (!this.checkAppDirectory(directory)) {
      process.exit(1);
    }

    this.createZip(directory);
  }
}
const pack = new Pack();
export default pack;
