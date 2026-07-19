const path = require("path")

const root = path.resolve(__dirname, "..")

module.exports = {
  apps: [
    {
      name: "landing",
      cwd: root,
      script: "npm",
      args: "run start -- --port 3000",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "",
        API_ORIGIN: "http://127.0.0.1:4000",
      },
    },
    {
      name: "landing-api",
      cwd: path.join(root, "server"),
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
}
