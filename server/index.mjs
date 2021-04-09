import express from "express";
import { resolve } from "path";
import { getRandomAnyChamps } from "./champs-service.mjs";
import { crawlChamps } from "./get-champs.mjs";

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

const app = express();

// Priority serve any static files.
app.use(express.static(resolve("./react-ui/build")));

// Answer API requests.
app.get("/champs", function (req, res) {
    res.set("Content-Type", "application/json");
    res.send(getRandomAnyChamps(4));
});

// All remaining requests return the React app, so it can handle routing.
app.get("*", function (request, response) {
    response.sendFile(resolve("./react-ui/build", "index.html"));
});

app.listen(PORT, function () {
    console.error(`Node ${isDev ? "dev server" : "cluster worker " + process.pid}: listening on port ${PORT}`);
});

crawlChamps();
