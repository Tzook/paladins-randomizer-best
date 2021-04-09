import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Champs from "./Champs";

function App() {
    /**
     * @type {[Socket, function]} socket
     */
    const [socket, setSocket] = useState();
    const [champs, setChamps] = useState([]);

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
        }
    }, [socket]);

    console.log(champs);
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                padding: "20px",
                backgroundColor: "#282c34",
                color: "white",
                textAlign: " center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
            }}>
            <span>Randomize!</span>
            <Champs champs={champs} />
        </div>
    );
}

export default App;
