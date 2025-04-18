import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { appConfig } from "../types";
import viteAPI from "./Vite";
import * as os from "os";

class Launcher {
  appConfig: appConfig | undefined;

  async readAppJson() {
    const appJsonPath = path.join(process.cwd(), "app.json");
    if (!fs.existsSync(appJsonPath)) {
      console.log("Error: ", "Can't find app.json");
      process.exit(1);
    }
    const data = fs.readFileSync(appJsonPath, "utf8");
    this.appConfig = JSON.parse(data) as appConfig;
  }

  async develope(): Promise<void> {
    this.readAppJson();
    const homeDir = os.homedir();
    const developeAppConfigPath = path.join(homeDir, "Documents", "GADA", "develope", this.appConfig!.name,"app.json");

    if (!this.appConfig!._id) {
      console.log("Error: ", "App id should receive first");
      process.exit(1);
    }

    fs.mkdirSync(path.dirname(developeAppConfigPath), { recursive: true });
    fs.writeFileSync(developeAppConfigPath, JSON.stringify(this.appConfig), { encoding: "utf-8" });

    await viteAPI.startViteServer();
    try {
      const response = await axios.post("http://localhost:7141/runLocalApp", {
        address: viteAPI.viteURL,
        name: this.appConfig!.name,
      });
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Error making POST request:", error.message);
    }
  }
}

const launcher = new Launcher();
export default launcher;
