import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
} from "@material-ui/core";
import { Close, Edit, Person, RemoveRedEye, Shuffle } from "@material-ui/icons";
import { useCallback, useRef, useState } from "react";
import Champ from "./Champ";
import Champs from "./Champs";
import { ICON_DROP_SHADOW } from "./constants";
import Talent from "./Talent";

const USER_SIZE = 96;

function User({ user, yourId, sendNewName, kick, champs, scrambleSelf }) {
    const userNameFieldRef = useRef(null);
    const [showBanDialog, setShowBanDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    const kickUser = useCallback(() => {
        kick(user.id);
    }, [user, kick]);

    const showBans = useCallback(() => {
        setShowBanDialog(true);
    }, []);
    const hideBans = useCallback(() => {
        setShowBanDialog(false);
    }, []);
    const showEdit = useCallback(() => {
        setShowEditDialog(true);
    }, []);
    const hideEdit = useCallback(() => {
        setShowEditDialog(false);
    }, []);
    const saveEdit = useCallback(
        (e) => {
            e.preventDefault();
            if (userNameFieldRef.current.value !== user.name) {
                sendNewName(userNameFieldRef.current.value);
            }
            hideEdit();
        },
        [hideEdit, userNameFieldRef, user, sendNewName]
    );
    const showInfo = useCallback(() => {
        setShowInfoDialog(true);
    }, []);
    const hideInfo = useCallback(() => {
        setShowInfoDialog(false);
    }, []);

    function getWinRate() {
        return Math.round((100 * user.apiData.wins) / (user.apiData.wins + user.apiData.losses));
    }

    function hasProfile() {
        return user.apiData && user.apiData.wins > 10;
    }

    return (
        <div
            style={{
                position: "relative",
                width: USER_SIZE,
                boxShadow: user.id === yourId ? "0 0 20px 6px white" : "",
            }}>
            <Champ champ={user.champ} size={USER_SIZE} />
            <div
                style={{
                    position: "absolute",
                    bottom: "6px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "0 4px",
                    borderRadius: "4px",
                    background: "rgba(0,0,0,0.6)",
                    cursor: user.id === yourId ? "pointer" : "default",
                    whiteSpace: "nowrap",
                }}
                onClick={user.id === yourId ? showEdit : null}>
                {user.name}
            </div>
            <div
                style={{
                    position: "absolute",
                    top: -15,
                    left: -15,
                    whiteSpace: "nowrap",
                }}>
                {user.id === yourId ? (
                    <span>
                        <Tooltip title="This is you! - Click to edit">
                            <IconButton style={{ background: "white" }} color="primary" size="small" onClick={showEdit}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Scramble">
                            <IconButton style={ICON_DROP_SHADOW} color="secondary" size="small" onClick={scrambleSelf}>
                                <Shuffle />
                            </IconButton>
                        </Tooltip>

                        <Dialog open={showEditDialog} onClose={hideEdit}>
                            <DialogTitle>Edit your profile:</DialogTitle>
                            <DialogContent>
                                <form noValidate onSubmit={saveEdit} autoComplete="off">
                                    <TextField
                                        inputRef={userNameFieldRef}
                                        label="Name"
                                        inputProps={{ maxLength: 16 }}
                                        defaultValue={user.name}
                                        autoFocus
                                        helperText="Write your Paladins name for better experience"
                                    />
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={hideEdit} color="secondary">
                                    Cancel
                                </Button>
                                <Button onClick={saveEdit} color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </span>
                ) : (
                    <span>
                        <Tooltip title="Kick">
                            <IconButton style={ICON_DROP_SHADOW} color="secondary" size="small" onClick={kickUser}>
                                <Close />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Champs">
                            <IconButton style={ICON_DROP_SHADOW} color="secondary" size="small" onClick={showBans}>
                                <RemoveRedEye />
                            </IconButton>
                        </Tooltip>

                        <Dialog open={showBanDialog} onClose={hideBans}>
                            <DialogTitle>Champs of '{user.name}':</DialogTitle>
                            <DialogContent>
                                <Champs
                                    champs={champs}
                                    lockedChamps={user.locks}
                                    apiUnownedChamps={(user.apiData || {}).unownedChamps}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={hideBans} color="primary" autoFocus>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </span>
                )}

                <Tooltip title="Profile">
                    <IconButton style={ICON_DROP_SHADOW} color="secondary" size="small" onClick={showInfo}>
                        <Person />
                        {hasProfile() ? `${getWinRate()}%` : ""}
                    </IconButton>
                </Tooltip>

                <Dialog open={showInfoDialog} onClose={hideInfo}>
                    <DialogTitle>Profile of '{user.name}':</DialogTitle>
                    <DialogContent>
                        {hasProfile() ? (
                            <div>
                                <DialogContentText>Level: {user.apiData.level}</DialogContentText>
                                <DialogContentText>Win rate: {getWinRate()}%</DialogContentText>
                                <DialogContentText>Steam name: {user.apiData.irlName}</DialogContentText>
                            </div>
                        ) : (
                            <div>
                                Couldn't fetch data for '{user.name}'. The player either does not exist, or has their
                                setting set to private.
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={hideInfo} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            {user.talent ? (
                <div
                    key={user.talent.name}
                    style={{
                        position: "absolute",
                        top: -24,
                        right: -24,
                    }}>
                    <Talent talent={user.talent} />
                </div>
            ) : null}
        </div>
    );
}

export default User;
