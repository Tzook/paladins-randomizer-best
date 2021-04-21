import { IconButton, Tooltip } from "@material-ui/core";
import { Close, Delete, Lock, Restore } from "@material-ui/icons";
import Champ, { CHAMP_IMAGE_SIZE } from "./Champ";

function Champs({ champs, lockedChamps = {}, toggleLock, bannedChamps = {}, toggleBan }) {
    return (
        <div
            style={{
                display: "grid",
                gridAutoFlow: "row",
                gridGap: 16,
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
                            opacity: lockedChamps[champ.name] || bannedChamps[champ.name] ? 0.4 : 1,
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
                        {toggleLock ? (
                            <div>
                                {lockedChamps[champ.name] ? (
                                    <Tooltip title={`Allow me to get '${champ.name}'`}>
                                        <IconButton color="primary" size="small" onClick={() => toggleLock(champ.name)}>
                                            <Restore />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title={`Don't give me '${champ.name}'`}>
                                        <IconButton
                                            color="secondary"
                                            size="small"
                                            onClick={() => toggleLock(champ.name)}>
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                        ) : null}
                        {toggleBan ? (
                            bannedChamps[champ.name] ? (
                                <Tooltip title={`Allow everyone to get '${champ.name}'`}>
                                    <IconButton color="primary" size="small" onClick={() => toggleBan(champ.name)}>
                                        <Restore />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title={`Don't give anyone '${champ.name}'`}>
                                    <IconButton color="secondary" size="small" onClick={() => toggleBan(champ.name)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            )
                        ) : null}
                    </div>
                    {lockedChamps[champ.name] || bannedChamps[champ.name] ? (
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                transform: "translateY(-50%)",
                                left: 0,
                                right: 0,
                                textAlign: "center",
                            }}>
                            <Tooltip title={`'${champ.name}' is locked`}>
                                <IconButton color="secondary" size="small">
                                    <Lock />
                                </IconButton>
                            </Tooltip>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
}

export default Champs;
