#!/usr/bin/env node
import fs from "fs";
import prompts from "prompts";
import { appConfig } from "../types";

class Config {
  async make() {
    // Load existing app.json if available
    let existingConfig: Partial<appConfig> = {};

    if (fs.existsSync("app.json")) {
      const fileData = fs.readFileSync("app.json", "utf-8");
      existingConfig = JSON.parse(fileData);
      console.log("Loaded existing configuration from app.json");
    }

    const response = await prompts([
      {
        type: "text",
        name: "name",
        message: "Enter the name:",
        initial: existingConfig.name || "",
        validate: (value: string) => /^[a-z_]+$/.test(value) || "Name should only contain small letters and underscores (_).",
      },
      {
        type: "text",
        name: "label",
        message: "Enter the label:",
        initial: existingConfig.label || "",
        validate: (value: string) => /^[A-Za-z\s]+$/.test(value) || "Label should only contain capital and small letters and spaces.",
      },
      {
        type: "text",
        name: "version",
        message: "Enter the version:",
        initial: existingConfig.version || "",
        validate: (value: string) => /^\d+\.\d+\.\d+$/.test(value) || "Version should follow the pattern 0.0.0.",
      },
    ]);

    const appConfig: appConfig = {
      name: response.name,
      label: response.label,
      version: response.version,
    };

    // Write to app.json
    fs.writeFileSync("app.json", JSON.stringify(appConfig, null, 2));

    console.log("app.json has been updated with the following data:");
    console.log(appConfig);
  }
}

const config = new Config();
export default config;
