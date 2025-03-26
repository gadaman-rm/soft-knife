#!/usr/bin/env node
import axios from "axios";
import * as fs from "fs";
import * as os from "os";
import path from "path";
import { accessFile, makeAppIdRequest, makeAppIdResponse, appConfig } from "../types";
import kleur from "kleur";

class Developer {
  read(directory: string): boolean {
    const appJsonPath = path.join(directory, "app.json");
    if (!fs.existsSync(appJsonPath)) {
      console.error(kleur.red(`Error: app.json not found in ${directory}`));
      return false;
    }

    const appConfig: appConfig = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
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

  async makeAppId() {
    const homeDir = os.homedir();
    const accessPath = path.join(homeDir, "Documents", "GADA", ".access");
    const appJsonPath = path.join(process.cwd(), "app.json");

    // Check if the .access file exists
    if (!fs.existsSync(accessPath)) {
      console.log(".access not exist.");
      return;
    }
    
    if (!fs.existsSync(appJsonPath)) {
      console.error(kleur.red(`Error: app.json not found in ${process.cwd()}`));
      return false;
    }

    const appConfig: appConfig = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
    if (!appConfig.name || !appConfig.label) {
      console.error(kleur.red(`Error: app.json is missing required fields (name or label)`));
      return false;
    }

    // Read the token from the .access file
    const accessFileString = fs.readFileSync(accessPath, "utf-8").trim();
    const accessFile: accessFile = JSON.parse(accessFileString);

    const makeAppIdResponse = (
      await axios.post("http://coolpanel.ir:7070/api/developer/makeAppId", {
        token: accessFile.token,
        name: appConfig.name,
      } as makeAppIdRequest)
    ).data as makeAppIdResponse;

    if (makeAppIdResponse.ok) {
      appConfig._id = makeAppIdResponse._id!;
      fs.writeFileSync(appJsonPath, JSON.stringify(appConfig), { encoding: "utf-8" });
      console.log("id add successfully.");
    } else console.error(kleur.red(`Error: ${makeAppIdResponse.msg}`));
  }
}

const developer = new Developer();
export default developer;
