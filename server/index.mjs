import express from "express";
import http from "http";
import { resolve } from "path";
import { crawlChamps } from "./champs-crawler.mjs";
import { Server } from "socket.io";
import { connectSocketio } from "./socket.mjs";

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

const app = express();

// Priority serve any static files.
app.use(express.static(resolve("./react-ui/build")));

// All remaining requests return the React app, so it can handle routing.
app.get("*", function (request, response) {
    response.sendFile(resolve("./react-ui/build", "index.html"));
});

const server = http.createServer(app).listen(PORT, function () {
    console.error(`Node ${isDev ? "dev server" : "cluster worker " + process.pid}: listening on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
connectSocketio(io);

crawlChamps();
