import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import Champs from "./Champs";
import Users from "./Users";

function App() {
    /**
     * @type {[Socket, function]} socket
     */
    const [socket, setSocket] = useState();
    const [champs, setChamps] = useState([]);
    const [users, setUsers] = useState([]);

    // Connect on load
    useEffect(() => {
        const isLocalHost =
            window.location.hostname === "localhost" || window.location.hostname.match(/\d+\.\d+\.\d+\.\d+/);
        const domain = isLocalHost ? `http://${window.location.hostname}:5000` : window.location.hostname;
        setSocket(io(domain, { reconnection: false }));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("welcome", ({ champs }) => {
                setChamps(champs);
            });
            socket.on("users", ({ users }) => {
                setUsers(users);
            });
        }
    }, [socket]);

    const scramble = useCallback(() => {
        console.log("Scrambled!");
    }, []);

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
            }}>
            <h1>Best Paladins Randomizer!</h1>
            <div>
                <Users users={users} scramble={scramble} />
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
