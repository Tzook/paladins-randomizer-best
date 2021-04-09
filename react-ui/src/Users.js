import { useCallback } from "react";
import { Button } from "@material-ui/core";
import User, { USER_SIZE } from "./User";

const TEAM_NAME_A = "a";
const TEAM_NAME_B = "b";

function Users({ users, scramble, yourId, sendNewName }) {
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
                            marginBottom: "8px",
                        }}>
                        <User user={user} yourId={yourId} sendNewName={sendNewName} />
                    </div>
                ))}
            </div>
            <div>
                <h2>VS</h2>
                <Button variant="contained" color="primary" onClick={scrambleClicked}>
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
                            marginBottom: "8px",
                        }}>
                        <User user={user} yourId={yourId} sendNewName={sendNewName} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
