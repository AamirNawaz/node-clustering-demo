const express = require("express");
const cluster = require("node:cluster");
const os = require("os");

const totalCpus = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }

  //this will check if any instance of cluster stop or down
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  const port = 9001;
  app.listen(port, () => console.log(`listening on port: ${port}`));
  app.get("/", (req, rest) => {
    return rest.json({
      message: `Hello from express app which runs on cluster mode with (process id)PID: ${process.pid}`,
    });
  });
}
