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

    // Connect on load
    useEffect(() => {
        const isLocalHost =
            window.location.hostname === "localhost" || window.location.hostname.match(/\d+\.\d+\.\d+\.\d+/);
        const domain = isLocalHost ? `http://${window.location.hostname}:5000` : window.location.hostname;

        const query = {};
        try {
            const name = localStorage.getItem("name");
            if (name) {
                query.name = name;
            }
        } catch {}
        setSocket(io(domain, { reconnection: false, query }));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("welcome", ({ champs, id }) => {
                setChamps(champs);
                setYourId(id);
            });
            socket.on("users", ({ users }) => {
                setUsers(users);
            });
            socket.on("settings", ({ settings }) => {
                setSettings(settings);
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
            <div>
                <Users
                    users={users}
                    scramble={scramble}
                    yourId={yourId}
                    sendNewName={sendNewName}
                    settings={settings}
                    updateSetting={updateSetting}
                />
            </div>
            <div
                style={{
                    marginTop: "auto",
                }}>
                <Champs champs={champs} />
            </div>
        </div>
    );
}

export default App;
