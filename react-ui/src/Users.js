import { Button, FormControlLabel, FormGroup, IconButton, Switch, Tooltip } from "@material-ui/core";
import User, { USER_SIZE } from "./User";
import { Redo, Undo } from "@material-ui/icons";

const TEAM_NAME_A = "a";
const TEAM_NAME_B = "b";

function Users({
    users,
    scramble,
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
                        <User user={user} yourId={yourId} sendNewName={sendNewName} kick={kick} champs={champs} />
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
                    }}>
                    <Tooltip title="Undo">
                        <span>
                            <IconButton disabled={!hasUndo} color="secondary" onClick={undo}>
                                <Undo />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Button variant="contained" color="primary" onClick={scramble}>
                        Scramble!
                    </Button>
                    <Tooltip title="Redo">
                        <span>
                            <IconButton disabled={!hasRedo} color="secondary" onClick={redo}>
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
                        <User user={user} yourId={yourId} sendNewName={sendNewName} kick={kick} champs={champs} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
