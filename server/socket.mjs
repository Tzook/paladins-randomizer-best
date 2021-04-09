import { getAllChamps } from "./champs-service.mjs";

export function connectSocketio(io) {
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.emit("welcome", { champs: getAllChamps() });
    });
}
