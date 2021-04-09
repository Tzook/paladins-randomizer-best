import { useCallback } from "react";
import { Button, FormControlLabel, FormGroup, Switch, Tooltip } from "@material-ui/core";
import User, { USER_SIZE } from "./User";

const TEAM_NAME_A = "a";
const TEAM_NAME_B = "b";

function Users({ users, scramble, yourId, sendNewName, settings, updateSetting }) {
    const teamA = users.filter((user) => user.team === TEAM_NAME_A);
    const teamB = users.filter((user) => user.team === TEAM_NAME_B);

    const scrambleClicked = useCallback(() => {
        scramble();
    }, [scramble]);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
            }}>
            <div
                style={{
                    width: USER_SIZE,
                    marginRight: "80px",
                }}>
                {teamA.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            marginBottom: "16px",
                        }}>
                        <User user={user} yourId={yourId} sendNewName={sendNewName} />
                    </div>
                ))}
            </div>
            <div>
                <h2>VS</h2>

                <FormGroup>
                    {Object.keys(settings).map((settingName) => (
                        <Tooltip title={settings[settingName].description}>
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

                <Button
                    style={{
                        marginTop: "12px",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={scrambleClicked}>
                    Scramble!
                </Button>
            </div>
            <div
                style={{
                    width: USER_SIZE,
                    marginLeft: "80px",
                }}>
                {teamB.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            marginBottom: "16px",
                        }}>
                        <User user={user} yourId={yourId} sendNewName={sendNewName} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
