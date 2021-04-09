import _ from "lodash";
import { getAllChamps } from "./champs-service.mjs";

const users = new Map();
const DEFAULT_CHAMP = {
    name: "",
    image: "https://yt3.ggpht.com/ytc/AAUvwng8YX7GkjTTqETCOLTE0BC0EkTq07OJmjMD1AFY=s88-c-k-c0x00ffffff-no-rj",
};

const TEAM_NAME_A = "a";
const TEAM_NAME_B = "b";

export function connectSocketio(io) {
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.emit("welcome", { champs: getAllChamps() });
        const team = chooseTeam();
        users.set(socket.id, { id: socket.id, name: "asdf", team, champ: DEFAULT_CHAMP });
        notifyUsers();

        socket.on("disconnect", () => {
            users.delete(socket.id);
            notifyUsers();
        });
    });

    function notifyUsers() {
        io.emit("users", { users: [...users.values()] });
    }
}

function chooseTeam() {
    let teamA = 0;
    let teamB = 0;
    for (const [, user] of users) {
        if (user.team === TEAM_NAME_A) {
            teamA++;
        } else {
            teamB++;
        }
    }
    if (teamA < teamB) {
        return TEAM_NAME_A;
    } else if (teamA > teamB) {
        return TEAM_NAME_B;
    } else {
        return _.sample([TEAM_NAME_A, TEAM_NAME_B]);
    }
}
