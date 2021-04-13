import { Button, Snackbar } from "@material-ui/core";
import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import Champs from "./Champs";
import Users from "./Users";

if (false) {
    // This is here just to remove the annoying log about Socket not used.
    const x = Socket;
    console.log(x);
}

function App() {
    /**
     * @type {[Socket, function]} socket
     */
    const [socket, setSocket] = useState();
    const [yourId, setYourId] = useState();
    const [champs, setChamps] = useState([]);
    const [users, setUsers] = useState([]);
    const [settings, setSettings] = useState({});
    const [disconnected, setDisconnected] = useState();
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationKey, setNotificationKey] = useState(0);
    const [hasUndo, setHasUndo] = useState();
    const [hasRedo, setHasRedo] = useState();
    const [lockedChamps, setLockedChamps] = useState({});
    const [bannedChamps, setBannedChamps] = useState({});

    // Connect on load
    useEffect(() => {
        const isLocalHost =
            window.location.hostname === "localhost" || window.location.hostname.match(/\d+\.\d+\.\d+\.\d+/);
        const domain = isLocalHost ? `http://${window.location.hostname}:5000` : window.location.hostname;

        const query = getConnectQuery();
        if (query.locksString) {
            try {
                const locks = JSON.parse(query.locksString);
                setLockedChamps(locks);
            } catch {}
        }
        setSocket(io(domain, { reconnection: false, query }));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("welcome", ({ champs, id }) => {
                setDisconnected(false);
                setChamps(champs);
                setYourId(id);
            });
            socket.on("users", ({ users }) => {
                setUsers(users);
            });
            socket.on("settings", ({ settings }) => {
                setSettings(settings);
            });
            socket.on("disconnect", () => {
                setDisconnected(true);
            });
            socket.on("notification", ({ message }) => {
                setNotificationMessage(message);
                setOpenNotification(true);
                setNotificationKey(Date.now());
            });
            socket.on("history", ({ undo, redo }) => {
                setHasUndo(undo);
                setHasRedo(redo);
            });
            socket.on("bans", ({ champs }) => {
                setBannedChamps((bannedChamps) => ({ ...bannedChamps, ...champs }));
            });
        }
    }, [socket]);

    useEffect(() => {
        for (const user of users) {
            if (user.id === yourId) {
                try {
                    localStorage.setItem("name", user.name);
                } catch {}
            }
        }
    }, [users, yourId]);

    const scramble = useCallback(() => {
        socket.emit("scramble");
    }, [socket]);

    const undo = useCallback(() => {
        socket.emit("undo");
    }, [socket]);

    const redo = useCallback(() => {
        socket.emit("redo");
    }, [socket]);

    const sendNewName = useCallback(
        (newName) => {
            socket.emit("name", { newName });
        },
        [socket]
    );
    const updateSetting = useCallback(
        (setting) => {
            socket.emit("setting", { setting });
        },
        [socket]
    );
    const kick = useCallback(
        (id) => {
            socket.emit("kick", { id });
        },
        [socket]
    );
    const reconnect = useCallback(() => {
        socket.io.opts.query = { ...socket.io.opts.query, ...getConnectQuery() };
        socket.connect();
    }, [socket]);

    const closeNotification = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenNotification(false);
    };

    const toggleLock = useCallback(
        (champName) => {
            socket.emit("lock", { champName });
            setLockedChamps((lockedChamps) => {
                const newLocks = { ...lockedChamps };
                newLocks[champName] = !newLocks[champName];
                if (!newLocks[champName]) {
                    delete newLocks[champName];
                }
                try {
                    localStorage.setItem("bans", JSON.stringify(newLocks));
                } catch {}
                return newLocks;
            });
        },
        [socket]
    );

    const toggleBan = useCallback(
        (champName) => {
            socket.emit("ban", { champName });
        },
        [socket]
    );

    console.log(champs, users);
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                padding: "20px",
                backgroundColor: "#282c34",
                color: "white",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
            }}>
            <h1>Best Paladins Randomizer!</h1>
            {disconnected ? (
                <div>
                    <h2>You have been kicked</h2>
                    <Button variant="contained" color="primary" onClick={reconnect}>
                        Reconnect
                    </Button>
                </div>
            ) : null}
            {disconnected || !users.length ? null : (
                <>
                    <div>
                        <Users
                            users={users}
                            scramble={scramble}
                            yourId={yourId}
                            sendNewName={sendNewName}
                            settings={settings}
                            updateSetting={updateSetting}
                            kick={kick}
                            undo={undo}
                            redo={redo}
                            hasUndo={hasUndo}
                            hasRedo={hasRedo}
                        />
                    </div>
                    <div
                        style={{
                            marginTop: "auto",
                        }}>
                        <Champs
                            champs={champs}
                            lockedChamps={lockedChamps}
                            toggleLock={toggleLock}
                            bannedChamps={bannedChamps}
                            toggleBan={toggleBan}
                        />
                    </div>
                </>
            )}
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                key={notificationKey}
                open={openNotification}
                autoHideDuration={4000}
                onClose={closeNotification}
                message={notificationMessage}
            />
        </div>
    );
}

function getConnectQuery() {
    const query = {};
    try {
        const name = localStorage.getItem("name");
        query.name = name || "";
    } catch {}
    try {
        const locksString = localStorage.getItem("bans");
        query.locksString = locksString || "";
    } catch {}
    return query;
}

export default App;
