import { IconButton, Tooltip } from "@material-ui/core";
import { Close, Restore } from "@material-ui/icons";
import Champ, { CHAMP_IMAGE_SIZE } from "./Champ";

function Champs({ champs, bannedChamps, toggleBan }) {
    return (
        <div
            style={{
                display: "grid",
                gridAutoFlow: "row",
                gridGap: 12,
                gridTemplateColumns: `repeat(auto-fill, ${CHAMP_IMAGE_SIZE}px)`,
                justifyContent: "center",
                maxWidth: "1200px",
                margin: "auto",
            }}>
            {champs.map((champ) => (
                <div
                    key={champ.name}
                    style={{
                        position: "relative",
                    }}>
                    <div
                        style={{
                            opacity: bannedChamps[champ.name] ? 0.4 : 1,
                        }}>
                        <Champ champ={champ} />
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            top: -15,
                            left: -15,
                            cursor: "pointer",
                        }}>
                        {bannedChamps[champ.name] ? (
                            <Tooltip title={`Allow getting '${champ.name}'`}>
                                <IconButton color="primary" size="small" onClick={() => toggleBan(champ.name)}>
                                    <Restore />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title={`Don't give me '${champ.name}'`}>
                                <IconButton color="secondary" size="small" onClick={() => toggleBan(champ.name)}>
                                    <Close />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Champs;
