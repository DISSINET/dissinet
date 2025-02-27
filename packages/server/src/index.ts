import "./settings"; // Must be the first import

import fs from "fs";
import https from "https";
import http from "http";
import { Server as SocketIO, Socket } from "socket.io";
import server from "./Server";
import { prepareTreeCache } from "@service/treeCache";
import "@service/mailer";
import { Db } from "@service/rethink";

(async () => {
  const db = new Db();
  await db.initDb();
  await prepareTreeCache(db.connection);
  const port = Number(process.env.PORT || 3000);
  const useHttps = process.env.HTTPS === "1";

  let httpServer: http.Server | https.Server;

  if (useHttps) {
    httpServer = https.createServer(
      {
        key: fs.readFileSync("secret/key.pem"),
        cert: fs.readFileSync("secret/cert.pem"),
      },
      server
    );
  } else {
    httpServer = http.createServer(server);
  }

  const socketio = new SocketIO(httpServer, {
    cors: {
      origin: "*",
    },
    path: "/socket.io/",
  });

  socketio.on("connection", (socket: Socket) => {
    socket.on("ping", (callback) => {
      callback();
    });
  });

  httpServer.listen(port, () => {
    console.log(
      `[Server] ${useHttps ? "https" : "http"} server listening at port ${port}`
    );
  });
})();
