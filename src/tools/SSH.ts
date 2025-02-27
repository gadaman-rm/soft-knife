import { Client } from "ssh2";
import * as fs from "fs";
import * as path from "path";

const configPath = "./softknife.json"; // Adjust if necessary
let sshConfig: any = {};

class SSH {
  uploadDir() {
    try {
      const configFile = fs.readFileSync(path.join(process.cwd(), configPath), "utf8");
      sshConfig = JSON.parse(configFile);
    } catch (error) {
      console.error("Error reading softknife.json:", error);
    }

    if (!sshConfig.host || !sshConfig.username) {
      console.error("Invalid SSH configuration");
      return;
    }

    const conn = new Client();

    conn
      .on("ready", () => {
        console.log("SSH Connection Established");

        conn.sftp((err, sftp) => {
          if (err) {
            console.error("SFTP Error:", err);
            conn.end();
            return;
          }

          const localDir = sshConfig.localDir;
          console.log("localDir:", localDir);
          const remoteDir = sshConfig.remoteDir;
          console.log("remoteDir:", remoteDir);

          this.uploadDirectory(sftp, path.join(process.cwd(), localDir), remoteDir, () => {
            console.log("Folder uploaded successfully");
            conn.end();
          });
        });
      })
      .on("error", (err) => {
        console.error("SSH Connection Error:", err);
      })
      .connect(sshConfig);
  }

  private uploadDirectory(sftp: any, localDir: string, remoteDir: string, callback: () => void) {
    fs.readdir(localDir, (err, files) => {
      if (err) {
        console.error("Error reading local directory:", err);
        return;
      }

      // Ensure the remote directory exists before uploading
      this.createRemoteDirectory(sftp, remoteDir, () => {
        let pendingFiles = files.length;

        if (pendingFiles === 0) {
          callback(); // No files to upload, finish
          return;
        }

        files.forEach((file) => {
          const localPath = path.join(localDir, file);
          const remotePath = `${remoteDir}/${file}`;

          fs.stat(localPath, (err, stats) => {
            if (err) {
              console.error("Error getting file stats:", err);
              return;
            }

            if (stats.isDirectory()) {
              // Recursively upload subdirectories
              this.uploadDirectory(sftp, localPath, remotePath, () => {
                pendingFiles--;
                if (pendingFiles === 0) callback();
              });
            } else {
              // Upload individual file
              this.uploadFile(sftp, localPath, remotePath, () => {
                pendingFiles--;
                if (pendingFiles === 0) callback();
              });
            }
          });
        });
      });
    });
  }

  private uploadFile(sftp: any, localPath: string, remotePath: string, callback: () => void) {
    const readStream = fs.createReadStream(localPath);
    const writeStream = sftp.createWriteStream(remotePath);

    writeStream.on("close", () => {
      console.log(`Uploaded: ${localPath} -> ${remotePath}`);
      callback();
    });

    writeStream.on("error", (err: any) => {
      console.error(`File upload error (${localPath}):`, err);
      callback();
    });

    readStream.pipe(writeStream);
  }

  private createRemoteDirectory(sftp: any, remoteDir: string, callback: () => void) {
    const pathParts = remoteDir.split("/").filter((part) => part); // Split by "/" and remove empty parts
    let currentPath = "";

    const createNext = (index: number) => {
      if (index >= pathParts.length) {
        callback();
        return;
      }

      currentPath += "/" + pathParts[index];

      sftp.mkdir(currentPath, (err: any) => {
        if (err && err.code !== 4) {
          console.error(`Error creating remote directory '${currentPath}':`, err);
          callback();
          return;
        }
        createNext(index + 1); // Recursively create the next directory
      });
    };

    createNext(0);
  }
}

const ssh = new SSH();
export default ssh;
