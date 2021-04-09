import { withStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

export const CHAMP_IMAGE_SIZE = 72;

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
                    outline: "1px solid #21f3e9",
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