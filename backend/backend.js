const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 8080;

// Proxy: /api/proxy/api-linter -> http://localhost:8000
app.use(
  "/api/proxy/api-linter",
  createProxyMiddleware({
    target: "http://localhost:8000",
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api/proxy/api-linter": "" }, // drop the prefix
    logLevel: "warn",
  }),
);

app.listen(PORT, () => {
  console.log("Backend server is running...");
});
