import { IconButton, Tooltip } from "@material-ui/core";
import { Close, Delete, Lock, Restore } from "@material-ui/icons";
import Champ, { CHAMP_IMAGE_SIZE } from "./Champ";
import { ICON_DROP_SHADOW } from "./constants";

function Champs({ champs, lockedChamps = {}, toggleLock, bannedChamps = {}, toggleBan, apiUnownedChamps = null }) {
    function doesntOwnChamp(champ) {
        return apiUnownedChamps && apiUnownedChamps[champ.name];
    }
    function isChampLocked(champ) {
        return lockedChamps[champ.name] || bannedChamps[champ.name] || doesntOwnChamp(champ);
    }
    function getLockTitle(champ) {
        if (doesntOwnChamp(champ)) {
            return `'${champ.name}' isn't owned`;
        } else if (bannedChamps[champ.name]) {
            return `'${champ.name}' is banned in the room`;
        } else {
            return `'${champ.name}' is disabled`;
        }
    }
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
                            opacity: isChampLocked(champ) ? 0.4 : 1,
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
                                        <IconButton
                                            style={ICON_DROP_SHADOW}
                                            color="primary"
                                            size="small"
                                            onClick={() => toggleLock(champ.name)}>
                                            <Restore />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title={`Don't give me '${champ.name}'`}>
                                        <IconButton
                                            style={ICON_DROP_SHADOW}
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
                                    <IconButton
                                        style={ICON_DROP_SHADOW}
                                        color="primary"
                                        size="small"
                                        onClick={() => toggleBan(champ.name)}>
                                        <Restore />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title={`Don't give anyone '${champ.name}'`}>
                                    <IconButton
                                        style={ICON_DROP_SHADOW}
                                        color="secondary"
                                        size="small"
                                        onClick={() => toggleBan(champ.name)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            )
                        ) : null}
                    </div>
                    {isChampLocked(champ) ? (
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                left: "50%",
                                textAlign: "center",
                            }}>
                            <Tooltip title={getLockTitle(champ)}>
                                <IconButton style={ICON_DROP_SHADOW} color="secondary" size="small">
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
