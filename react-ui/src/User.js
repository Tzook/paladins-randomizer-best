import Champ, { CHAMP_IMAGE_SIZE } from "./Champ";

function User({ user }) {
    return (
        <div
            style={{
                position: "relative",
                width: CHAMP_IMAGE_SIZE,
            }}>
            <Champ champ={user.champ} />
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
