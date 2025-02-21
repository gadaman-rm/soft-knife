import { Client } from "ssh2";
import * as fs from "fs";

class UploadSSH {
  upload() {
    const sshConfig = {
      host: "coolpanel.ir",
      port: 22,
      username: "root",
      password: "~!@#lig4EVER#@!~", // Prefer SSH keys instead
      // privateKey: fs.readFileSync('/path/to/private/key') // Use this for SSH key authentication
    };

    const localFilePath = "./localfile.txt"; // Change this
    const remoteFilePath = "/home/user/localfile.txt"; // Change this

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

          const readStream = fs.createReadStream(localFilePath);
          const writeStream = sftp.createWriteStream(remoteFilePath);

          writeStream.on("close", () => {
            console.log("File uploaded successfully");
            conn.end();
          });

          writeStream.on("error", (err: any) => {
            console.error("File upload error:", err);
            conn.end();
          });

          readStream.pipe(writeStream);
        });
      })
      .on("error", (err) => {
        console.error("SSH Connection Error:", err);
      })
      .connect(sshConfig);
  }
}

const uploadSSH = new UploadSSH();
export default uploadSSH;
