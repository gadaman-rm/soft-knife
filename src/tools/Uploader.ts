import fs from "fs";
import path from "path";
import os from "os";
import FormData from "form-data";
import axios from "axios";
import { accessFile } from "../types";

const uploadUrl = "http://localhost:7070/upload"; // URL of the upload server
const fileName = "test.zip"; // The name of the file to upload

class Uploader {
  async upload() {
    // Get the current working directory
    const rootDir = process.cwd();

    // Resolve the full path to the file
    const filePath = path.join(rootDir, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      console.log(`Please ensure the file "${fileName}" exists in the current directory: ${rootDir}`);
      process.exit(1);
    }

    // Get the path to the .access file in the user's home directory
    const homeDir = os.homedir();
    const accessPath = path.join(homeDir, "Documents", "GADA", ".access");

    // Check if the .access file exists
    if (!fs.existsSync(accessPath)) {
      console.error(`.access file not found: ${accessPath}`);
      console.log("Please Login first.");
      process.exit(1);
    }

    // Read the token from the .access file
    const accessFileString = fs.readFileSync(accessPath, "utf-8").trim();
    const accessFile: accessFile = JSON.parse(accessFileString);

    if (!accessFile.token) {
      console.error("Token is empty. Please ensure the .access file contains a valid token.");
      process.exit(1);
    }

    // Create a FormData object and append the file
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), {
      filename: path.basename(filePath),
    });

    // Send the file to the server
    try {
      const response = await axios.post(uploadUrl, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${accessFile.token}`,
        },
      });
      console.log("Server response:", response.data);
    } catch (error: any) {
      console.error("Error uploading file:", error.message);
    }
  }
}

const uploader = new Uploader();
export default uploader;
