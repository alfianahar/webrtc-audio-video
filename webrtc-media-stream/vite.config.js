import { defineConfig } from "vite";

export default defineConfig({
  server: {
    https: {
      key: "key.pem",
      cert: "cert.pem",
    },
  },
});
