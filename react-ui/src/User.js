import { IconButton, Tooltip } from "@material-ui/core";
import { Close, InsertEmoticon } from "@material-ui/icons";
import { useCallback } from "react";
import Champ from "./Champ";
import Talent from "./Talent";

export const USER_SIZE = 86;

function User({ user, yourId, sendNewName, kick }) {
    const updateName = useCallback(
        (event) => {
            const text = event.target.innerText;
            if (text !== user.name) {
                sendNewName(text);
            }
        },
        [user, sendNewName]
    );

    const kickUser = useCallback(() => {
        kick(user.id);
    }, [user, kick]);

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
                boxShadow: user.id === yourId ? "0 0 20px 6px white" : "",
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
            <div
                style={{
                    position: "absolute",
                    top: -15,
                    left: -15,
                }}>
                {user.id === yourId ? (
                    <Tooltip title="This is you :)">
                        <IconButton style={{ background: "white" }} color="primary" size="small">
                            <InsertEmoticon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Kick">
                        <IconButton color="secondary" size="small" onClick={kickUser}>
                            <Close />
                        </IconButton>
                    </Tooltip>
                )}
            </div>

            {user.talent ? (
                <div
                    key={user.talent.name}
                    style={{
                        position: "absolute",
                        top: -24,
                        right: -24,
                    }}>
                    <Talent talent={user.talent} />
                </div>
            ) : null}
        </div>
    );
}

export default User;
