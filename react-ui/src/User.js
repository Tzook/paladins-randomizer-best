import { IconButton, Tooltip } from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import { useCallback } from "react";
import Champ from "./Champ";

export const USER_SIZE = 86;

function User({ user, yourId, sendNewName }) {
    const updateName = useCallback(
        (event) => {
            const text = event.target.innerText;
            if (text !== user.name) {
                sendNewName(text);
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
                    spellCheck={false}
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
            {user.id === yourId ? (
                <div
                    style={{
                        position: "absolute",
                        top: -15,
                        left: -15,
                    }}>
                    <Tooltip title="This is you :)">
                        <IconButton style={{ background: "white" }} color="primary" size="small">
                            <InsertEmoticon />
                        </IconButton>
                    </Tooltip>
                </div>
            ) : null}
        </div>
    );
}

export default User;
