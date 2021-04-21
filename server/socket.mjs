import _ from "lodash";
import { getRandomChamp } from "./champs-service.mjs";
import { getAllChamps } from "./champs-service.mjs";
import { getRandomName } from "mmo-name-generator";

const users = new Map();
let usersHistory = [];
let usersFuture = [];
const MAX_HISTORY_LENGTH = 20;
const DEFAULT_CHAMP = {
    name: "",
    image: "https://yt3.ggpht.com/ytc/AAUvwng8YX7GkjTTqETCOLTE0BC0EkTq07OJmjMD1AFY=s88-c-k-c0x00ffffff-no-rj",
};

export const ROLE_FRONTLINE = "Frontline";
export const ROLE_SUPPORT = "Support";
export const ROLE_DAMAGE = "Damage";
export const ROLE_FLANK = "Flank";
const SETTING_MIRROR = "Mirror";
const SETTING_TALENT = "Random Talent";
// const SETTING_MATCH_ROLES = "Match Roles";

const TEAM_NAME_A = "a";
const TEAM_NAME_B = "b";
const settings = {
    [ROLE_FRONTLINE]: { value: true, description: "Enable frontline roles" },
    [ROLE_SUPPORT]: { value: true, description: "Enable support roles" },
    [ROLE_DAMAGE]: { value: true, description: "Enable damage roles" },
    [ROLE_FLANK]: { value: true, description: "Enable flank roles" },
    [SETTING_MIRROR]: { value: false, description: "Make both teams the same champions" },
    [SETTING_TALENT]: { value: false, description: "Tells you which talent to pick on the champion" },
    // [SETTING_MATCH_ROLES]: { value: true, description: "Ensure that both teams have the same roles" },
};

const bans = {};

export function connectSocketio(io) {
    io.on("connection", (socket) => {
        console.log("a user connected", socket.id, socket.handshake.query.name);
        socket.emit("welcome", { champs: getAllChamps(), id: socket.id });
        socket.emit("settings", { settings });
        const team = chooseTeam();
        const name = getValidName(socket.handshake.query.name);
        const locks = getValidLocks(socket.handshake.query.locksString);
        users.set(socket.id, { id: socket.id, name, team, champ: DEFAULT_CHAMP, locks });
        notifyUsers();
        resetHistory();
        socket.emit("bans", { champs: bans });

        io.emit("notification", {
            message: `'${users.get(socket.id).name}' was connected.`,
        });

        socket.on("disconnect", () => {
            if (users.has(socket.id)) {
                io.emit("notification", {
                    message: `'${users.get(socket.id).name}' was disconnected.`,
                });
                users.delete(socket.id);
                resetHistory();
                notifyUsers();
            }
        });

        socket.on("name", ({ newName }) => {
            const name = getValidName(newName);
            io.emit("notification", {
                message: `Name of '${users.get(socket.id).name}' was updated to '${name}'.`,
            });
            users.get(socket.id).name = name;
            notifyUsers();
        });

        socket.on("setting", ({ setting }) => {
            if (settings.hasOwnProperty(setting)) {
                settings[setting].value = !settings[setting].value;
                if (setting === SETTING_TALENT) {
                    updateTalents();
                    notifyUsers();
                }
                io.emit("settings", { settings });
                io.emit("notification", {
                    message: `Setting '${setting}' was toggled by '${users.get(socket.id).name}'.`,
                });
            }
        });

        socket.on("scramble", () => {
            storeHistoryArray(usersHistory);
            notifyHistory();
            scramble();
            io.emit("notification", { message: `Scrambled by '${users.get(socket.id).name}'.` });
        });

        socket.on("scrambleSelf", () => {
            storeHistoryArray(usersHistory);
            notifyHistory();
            scrambleOne(users.get(socket.id));
            notifyUsers();
            io.emit("notification", { message: `Self scrambled by '${users.get(socket.id).name}'.` });
        });

        socket.on("kick", ({ id }) => {
            if (users.has(id)) {
                io.emit("notification", {
                    message: `'${users.get(id).name}' was kicked by '${users.get(socket.id).name}'.`,
                });
                users.delete(id);
                notifyUsers();
                resetHistory();
            }
            io.sockets.sockets.forEach((sock) => {
                if (sock.id === id) {
                    sock.disconnect(true);
                }
            });
        });

        socket.on("undo", () => {
            if (usersHistory.length) {
                io.emit("notification", { message: `Undo by '${users.get(socket.id).name}'.` });
                storeHistoryArray(usersFuture);
                popHistoryArray(usersHistory);
            }
        });

        socket.on("redo", () => {
            if (usersFuture.length) {
                io.emit("notification", { message: `Redo by '${users.get(socket.id).name}'.` });
                storeHistoryArray(usersHistory);
                popHistoryArray(usersFuture);
            }
        });

        socket.on("lock", ({ champName }) => {
            if (_.isString(champName)) {
                const user = users.get(socket.id);
                user.locks[champName] = !user.locks[champName];
                notifyUsers();
                if (!user.locks[champName]) {
                    delete user.locks[champName];
                }
            }
        });

        socket.on("ban", ({ champName }) => {
            if (_.isString(champName)) {
                bans[champName] = !bans[champName];
                io.emit("bans", { champs: { [champName]: bans[champName] } });
                io.emit("notification", {
                    message: `Champ '${champName}' ${bans[champName] ? "" : "un"}banned by '${
                        users.get(socket.id).name
                    }'.`,
                });
                if (!bans[champName]) {
                    delete bans[champName];
                }
            }
        });

        function storeHistoryArray(array) {
            const historyRow = [];
            for (const [id, { team, champ, talent }] of users) {
                historyRow.push({ id, team, champ, talent });
            }
            array.push(historyRow);
            if (array.length > MAX_HISTORY_LENGTH) {
                array.shift();
            }
        }

        function popHistoryArray(array) {
            const historyRow = array.pop();
            for (const userHistory of historyRow) {
                const user = users.get(userHistory.id);
                users.set(user.id, { ...user, ...userHistory });
            }
            notifyUsers();
            notifyHistory();
        }

        function resetHistory() {
            usersHistory = [];
            usersFuture = [];
            notifyHistory();
        }

        function notifyHistory() {
            io.emit("history", {
                undo: usersHistory.length > 0,
                redo: usersFuture.length > 0,
            });
        }

        function scramble() {
            const usersList = [...users.values()];
            const shuffledUsers = _.shuffle(usersList);
            const teamGroups = _.shuffle([TEAM_NAME_A, TEAM_NAME_B]);
            const teams = [[], []];

            for (let i = 0; i < shuffledUsers.length; i++) {
                teams[i % 2].push(shuffledUsers[i]);
                shuffledUsers[i].team = teamGroups[i % 2];
            }

            const takenChamps = {};
            for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
                const team = teams[teamIndex];
                const shouldMirror = settings[SETTING_MIRROR].value && teamIndex === 1;
                for (let userIndex = 0; userIndex < team.length; userIndex++) {
                    const user = team[userIndex];

                    if (shouldMirror) {
                        user.champ = teams[0][userIndex].champ;
                    } else {
                        const blacklists = [takenChamps, user.locks, bans];
                        if (settings[SETTING_MIRROR].value && teams[1][userIndex]) {
                            blacklists.push(teams[1][userIndex].locks);
                        }
                        user.champ = getRandomChamp(settings, Object.assign(...blacklists));
                        if (!user.champ) {
                            user.champ = DEFAULT_CHAMP;
                        }
                        takenChamps[user.champ.name] = true;
                    }
                }
            }
            updateTalents();
            notifyUsers();
        }

        function scrambleOne(user) {
            const usersToReplace = [user];
            const takenChamps = {};
            const blacklists = [takenChamps, user.locks, bans];
            for (const [, currentUser] of users) {
                takenChamps[currentUser.champ.name] = true;
                // Find a mirrored user
                if (
                    settings[SETTING_MIRROR].value &&
                    currentUser.champ === user.champ &&
                    currentUser.team !== user.team &&
                    usersToReplace.length < 2
                ) {
                    usersToReplace.push(currentUser);
                    blacklists.push(currentUser.locks);
                }
            }
            const champ = getRandomChamp(settings, Object.assign(...blacklists)) || DEFAULT_CHAMP;
            const talent = settings[SETTING_TALENT].value ? _.sample(champ.talents) : undefined;
            for (const userToReplace of usersToReplace) {
                userToReplace.champ = champ;
                userToReplace.talent = talent;
            }
        }
    });

    function updateTalents() {
        const champsTalents = {};
        for (const [, user] of users) {
            if (!settings[SETTING_TALENT].value) {
                user.talent = undefined;
                continue;
            }
            const champName = user.champ.name;
            if (!settings[SETTING_MIRROR].value || !champsTalents[champName]) {
                champsTalents[champName] = _.sample(user.champ.talents);
            }
            user.talent = champsTalents[champName];
        }
    }

    function notifyUsers() {
        io.emit("users", { users: [...users.values()] });
    }
}

function chooseTeam() {
    const { teamA, teamB } = getTeamCounts();

    if (teamA < teamB) {
        return TEAM_NAME_A;
    } else if (teamA > teamB) {
        return TEAM_NAME_B;
    } else {
        return _.sample([TEAM_NAME_A, TEAM_NAME_B]);
    }
}

function getValidName(name) {
    return name && _.isString(name) ? name.substring(0, 16) : getRandomName();
}

function getValidLocks(locksString) {
    try {
        const locks = JSON.parse(locksString);
        if (_.isPlainObject(locks)) {
            return locks;
        }
    } catch {}
    return {};
}

function getTeamCounts() {
    let teamA = 0;
    let teamB = 0;
    for (const [, user] of users) {
        if (user.team === TEAM_NAME_A) {
            teamA++;
        } else {
            teamB++;
        }
    }
    return { teamA, teamB };
}
