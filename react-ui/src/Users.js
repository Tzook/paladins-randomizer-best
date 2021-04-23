import { Button, FormControlLabel, FormGroup, IconButton, Switch, Tooltip } from "@material-ui/core";
import User, { USER_SIZE } from "./User";
import { Redo, Undo } from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";
import { ICON_DROP_SHADOW } from "./constants";

const TEAM_NAME_A = "a";
const TEAM_NAME_B = "b";

function Users({
    users,
    scramble,
    scrambleSelf,
    yourId,
    sendNewName,
    settings,
    updateSetting,
    kick,
    undo,
    redo,
    hasUndo,
    hasRedo,
    champs,
}) {
    const [inScrambleCooldown, setInScrambleCooldown] = useState(false);

    useEffect(() => {
        if (inScrambleCooldown) {
            setTimeout(() => setInScrambleCooldown(false), 1000);
        }
    }, [inScrambleCooldown]);

    const scrambleClicked = useCallback(() => {
        if (!inScrambleCooldown) {
            scramble();
            setInScrambleCooldown(true);
        }
    }, [scramble, inScrambleCooldown]);

    const scrambleSelfClicked = useCallback(() => {
        if (!inScrambleCooldown) {
            scrambleSelf();
            setInScrambleCooldown(true);
        }
    }, [scrambleSelf, inScrambleCooldown]);

    const undoClicked = useCallback(() => {
        if (!inScrambleCooldown) {
            undo();
            setInScrambleCooldown(true);
        }
    }, [undo, inScrambleCooldown]);

    const redoClicked = useCallback(() => {
        if (!inScrambleCooldown) {
            redo();
            setInScrambleCooldown(true);
        }
    }, [redo, inScrambleCooldown]);

    const teamA = users.filter((user) => user.team === TEAM_NAME_A);
    const teamB = users.filter((user) => user.team === TEAM_NAME_B);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
            }}>
            <div style={{ width: USER_SIZE }}>
                {teamA.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            marginBottom: "16px",
                        }}>
                        <User
                            user={user}
                            yourId={yourId}
                            sendNewName={sendNewName}
                            kick={kick}
                            champs={champs}
                            scrambleSelf={scrambleSelfClicked}
                        />
                    </div>
                ))}
            </div>
            <div
                style={{
                    margin: "0 80px",
                }}>
                <h2>VS</h2>

                <FormGroup>
                    {Object.keys(settings).map((settingName) => (
                        <Tooltip title={settings[settingName].description} key={settingName}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings[settingName].value}
                                        onChange={() => updateSetting(settingName)}
                                    />
                                }
                                label={settingName}
                            />
                        </Tooltip>
                    ))}
                </FormGroup>

                <div
                    style={{
                        margin: "12px -40px",
                        transition: "opacity .3s",
                        opacity: inScrambleCooldown ? 0.4 : 1,
                    }}>
                    <Tooltip title="Undo">
                        <span>
                            <IconButton
                                style={{ ...ICON_DROP_SHADOW, cursor: inScrambleCooldown ? "not-allowed" : "" }}
                                disabled={!hasUndo}
                                color="secondary"
                                onClick={undoClicked}>
                                <Undo />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Button
                        style={{
                            cursor: inScrambleCooldown ? "not-allowed" : "",
                        }}
                        variant="contained"
                        color="primary"
                        onClick={scrambleClicked}>
                        Scramble!
                    </Button>
                    <Tooltip title="Redo">
                        <span>
                            <IconButton
                                style={{ ...ICON_DROP_SHADOW, cursor: inScrambleCooldown ? "not-allowed" : "" }}
                                disabled={!hasRedo}
                                color="secondary"
                                onClick={redoClicked}>
                                <Redo />
                            </IconButton>
                        </span>
                    </Tooltip>
                </div>
            </div>
            <div style={{ width: USER_SIZE }}>
                {teamB.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            marginBottom: "16px",
                        }}>
                        <User
                            user={user}
                            yourId={yourId}
                            sendNewName={sendNewName}
                            kick={kick}
                            champs={champs}
                            scrambleSelf={scrambleSelf}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
