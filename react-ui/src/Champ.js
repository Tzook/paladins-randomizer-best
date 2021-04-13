import { withStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

export const CHAMP_IMAGE_SIZE = 64;

const ROLE_DATA_TO_BORDER_COLOR = {
    "Paladins Front Line": "#21f3e9",
    "Paladins Support": "#FFE900",
    "Paladins Damage": "#FF4242",
    "Paladins Flanker": "#645DD7",
    undefined: "white",
};

const ChampTooltip = withStyles((theme) => ({
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

function Champ({ champ, size = CHAMP_IMAGE_SIZE }) {
    return (
        <ChampTooltip title={champ.name} arrow>
            <img
                style={{
                    outline: `1px solid ${ROLE_DATA_TO_BORDER_COLOR[champ.role]}`,
                }}
                src={champ.image}
                width={size}
                height={size}
                alt=""
            />
        </ChampTooltip>
    );
}

export default Champ;
