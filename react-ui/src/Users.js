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
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}>
            <div
                style={{
                    width: "0",
                    margin: "auto",
                }}>
                {teamA.map((user) => (
                    <User key={user.id} user={user} />
                ))}
            </div>
            <div>
                <h2>VS</h2>
                <Button onClick={scrambleClicked}>Scramble!</Button>
            </div>
            <div
                style={{
                    width: "0",
                    margin: "auto",
                }}>
                {teamB.map((user) => (
                    <User key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

export default Users;
