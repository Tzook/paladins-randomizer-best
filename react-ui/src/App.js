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

    // Connect on load
    useEffect(() => {
        const isLocalHost =
            window.location.hostname === "localhost" || window.location.hostname.match(/\d+\.\d+\.\d+\.\d+/);
        const domain = isLocalHost ? `http://${window.location.hostname}:5000` : window.location.hostname;

        const query = getConnectQuery();
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
        }
    }, [socket]);

    useEffect(() => {
        for (const user of users) {
            if (user.id === yourId) {
                // Why kick resets local storage????
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
                        <Champs champs={champs} />
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
    return query;
}

export default App;
