module.exports = {
  apps: [
    {
      name: "WiFi Tracing Server",
      script: "index.js",
      instances: "max",
      kill_timeout: 30000,
      env: {
        NODE_ENV: "dev"
      }
    }
  ]
}
