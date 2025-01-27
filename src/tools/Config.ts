import fs from "fs";
import prompts from "prompts";
import { appConfig } from "../types";

class Config {
  async make() {
    const response = await prompts([
      {
        type: "text",
        name: "name",
        message: "Enter the name:",
      },
      {
        type: "text",
        name: "label",
        message: "Enter the label:",
      },
    ]);

    const appConfig: appConfig = {
      name: response.name,
      label: response.label,
    };

    // Write to app.json
    fs.writeFileSync("app.json", JSON.stringify(appConfig, null, 2));

    console.log("app.json has been updated with the following data:");
    console.log(appConfig);
  }
}

const config = new Config();
export default config;
