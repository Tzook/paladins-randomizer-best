import { IconButton, withStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { ErrorOutline } from "@material-ui/icons";
import { useState } from "react";

export const TALENT_IMAGE_SIZE = 64;

const TalentTooltip = withStyles((theme) => ({
    arrow: {
        color: theme.palette.common.white,
    },
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: theme.shadows[1],
        fontSize: 16,
    },
}))(Tooltip);

function Talent({ talent }) {
    const [hadError, setHadError] = useState();

    return (
        <TalentTooltip title={talent.name} arrow>
            {hadError ? (
                <IconButton style={{ background: "white" }} color="secondary" size="small">
                    <ErrorOutline fontSize="large" />
                </IconButton>
            ) : (
                <img
                    style={{
                        borderRadius: "100%",
                    }}
                    onError={setHadError}
                    src={talent.image}
                    width={TALENT_IMAGE_SIZE}
                    height={TALENT_IMAGE_SIZE}
                    alt=""
                />
            )}
        </TalentTooltip>
    );
}

export default Talent;
