#!/usr/bin/env node
import axios from "axios";
import * as readline from "readline";
import * as fs from "fs";
import * as os from "os";
import path from "path";
import {
  accessRequest,
  accessResponse,
  signinRequest,
  signinResponse,
  accessFile,
  verifyRequest,
  verifyResponse,
} from "../types";

// Function to prompt the user for input
const promptUser = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
};

class Authenticator {
  async access() {
    const homeDir = os.homedir();
    const accessPath = path.join(homeDir, "Documents", "GADA", ".access");

    // Check if the .access file exists
    if (!fs.existsSync(accessPath)) {
      console.log(".access not exist.");
      this.login();
    } else {
      // Read the token from the .access file
      const accessFileString = fs.readFileSync(accessPath, "utf-8").trim();
      const accessFile: accessFile = JSON.parse(accessFileString);

      const accessResponse = (
        await axios.post("http://coolpanel.ir:7070/api/developer/access", {
          tel: accessFile.tel,
          token: accessFile.token,
        } as accessRequest)
      ).data as accessResponse;

      if (accessResponse.ok) {
        accessFile.token = accessResponse.token!;
        fs.writeFileSync(accessPath, JSON.stringify(accessFile), { encoding: "utf-8" });
        console.log("Token updated successfully.");
      } else {
        console.log(accessResponse.msg);
        this.login();
      }
    }
  }

  async login() {
    try {
      // Get the user's phone number
      const tel = await promptUser("Enter your phone number: ");

      // Send the phone number to the server
      const signinResponse = (
        await axios.post("http://coolpanel.ir:7070/api/developer/signin", {
          tel: tel,
        } as signinRequest)
      ).data as signinResponse;

      if (signinResponse.ok) {
        console.log("Verification code sent successfully.");
      } else {
        console.log(signinResponse.msg);
        process.exit(1);
      }

      // Request the user to enter the verification code
      const verifyCode = await promptUser("Enter the verification code you received: ");

      // Send the verification code to the server
      const verifyResponse = (
        await axios.post("http://coolpanel.ir:7070/api/developer/verify", {
          tel: tel,
          code: verifyCode,
        } as verifyRequest)
      ).data as verifyResponse;

      if (verifyResponse.ok && verifyResponse.token) {
        console.log("Verification successful. Saving token...");

        // Save the token to a .access file in the user's home directory
        const accessPath = path.join(os.homedir(), "Documents", "GADA", ".access");

        const accessFile: accessFile = {
          tel: tel,
          token: verifyResponse.token,
        };

        fs.writeFileSync(accessPath, JSON.stringify(accessFile), { encoding: "utf-8" });

        console.log(`Token saved successfully at ${accessPath}`);
      } else {
        console.log(verifyResponse.msg);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

const authenticator = new Authenticator();
export default authenticator;
