import { useCallback } from "react";
import { Button } from "@material-ui/core";
import User from "./User";

const TEAM_NAME_A = "a";
const TEAM_NAME_B = "b";

function Users({ users, scramble }) {
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
            }}>
            <div
                style={{
                    width: "0",
                    margin: "0 auto",
                }}>
                {teamA.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            marginBottom: "8px",
                        }}>
                        <User user={user} />
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
                    width: "0",
                    margin: "0 auto",
                }}>
                {teamB.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            marginBottom: "8px",
                        }}>
                        <User user={user} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
