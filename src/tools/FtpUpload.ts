import * as ftp from "basic-ftp";
import * as path from "path";
import kleur from "kleur";

interface FtpConfig {
  host: string;
  user: string;
  password: string;
  localFile: string;
  ftpDir: string;
  remoteName?: string;
}

class FtpUpload {
  async upload(config: FtpConfig) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
      console.log(kleur.cyan("Connecting to FTP server..."));

      await client.access({
        host: config.host,
        user: config.user,
        password: config.password,
        secure: false,
      });

      console.log(kleur.green("Connected successfully!"));

      const trueFtpDir = config.ftpDir.replace(/\\/g, "/");

      // Ensure the remote directory exists
      try {
        await client.ensureDir(trueFtpDir);
      } catch (err) {
        console.log(kleur.yellow(`Warning: Could not ensure directory ${config.ftpDir} exists`));
      }

      // Upload the file
      console.log(kleur.cyan(`Uploading ${config.localFile} to ${trueFtpDir}...`));

      const remoteFileName = config.remoteName || path.basename(config.localFile);
      console.log(kleur.cyan(`Remote filename will be: ${remoteFileName}`));

      await client.uploadFrom(config.localFile, path.join(trueFtpDir, remoteFileName));

      console.log(kleur.green("Upload completed successfully!"));
    } catch (err) {
      console.error(kleur.red("Error during FTP upload:"), err);
      throw err;
    } finally {
      client.close();
    }
  }
}

const ftpUpload = new FtpUpload();
export default ftpUpload;
