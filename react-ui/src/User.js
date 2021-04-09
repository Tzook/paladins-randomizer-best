import { useCallback, useEffect } from "react";
import Champ from "./Champ";

export const USER_SIZE = 86;

let yourUserGlobal;
let alreadySetName;

function User({ user, yourId, sendNewName }) {
    if (user.id === yourId) {
        yourUserGlobal = user;
    }
    useEffect(() => {
        if (!alreadySetName) {
            alreadySetName = true;
            const name = localStorage.getItem("name");
            if (name && name !== yourUserGlobal.name) {
                sendNewName(name);
            }
        }
    }, [sendNewName]);

    const updateName = useCallback(
        (event) => {
            const text = event.target.innerText;
            if (text !== user.name) {
                sendNewName(text);
                try {
                    localStorage.setItem("name", text);
                } catch {}
            }
        },
        [user, sendNewName]
    );

    const updateNameIfDone = useCallback((event) => {
        if (event.key === "Enter") {
            event.stopPropagation();
            event.preventDefault();
            event.target.blur();
        }
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: USER_SIZE,
            }}>
            <Champ champ={user.champ} size={USER_SIZE} />
            <div
                style={{
                    position: "absolute",
                    bottom: "6px",
                    left: "0",
                    right: "0",
                }}>
                <span
                    contentEditable={user.id === yourId}
                    suppressContentEditableWarning={true}
                    onKeyDown={updateNameIfDone}
                    onBlur={updateName}
                    style={{
                        padding: "0 4px",
                        borderRadius: "4px",
                        background: "rgba(0,0,0,0.6)",
                        cursor: user.id === yourId ? "" : "default",
                        margin: "0 -28px",
                        whiteSpace: "nowrap",
                    }}>
                    {user.name}
                </span>
            </div>
        </div>
    );
}

export default User;
