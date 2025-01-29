import { createServer } from "vite";

class ViteAPI {
  viteURL: string | undefined;
  async startViteServer() {
    try {
      const server = await createServer({
        root: "./", // Specify your project root
        server: {
          port: 5174, // You can define your port here
        },
      });

      await server.listen();

      const addressInfo = server.httpServer?.address();
      console.log("addressInfo: ", addressInfo);

      if (typeof addressInfo === "object" && addressInfo !== null) {
        const host = addressInfo.address === "::1" ? "localhost" : addressInfo.address;
        const port = addressInfo.port;
        this.viteURL = `http://${host}:${port}`;

        console.log(`Vite running at: ${this.viteURL}`);
      } else {
        console.error("Failed to capture Vite server address.");
      }
    } catch (error) {
      console.error("Error starting Vite server:", error);
    }
  }
}
const viteAPI = new ViteAPI();
export default viteAPI;
