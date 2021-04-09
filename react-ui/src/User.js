import Champ from "./Champ";

const USER_SIZE = 86;

function User({ user }) {
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
                    style={{
                        padding: "0 4px",
                        borderRadius: "4px",
                        background: "rgba(0,0,0,0.6)",
                    }}>
                    {user.name}
                </span>
            </div>
        </div>
    );
}

export default User;
