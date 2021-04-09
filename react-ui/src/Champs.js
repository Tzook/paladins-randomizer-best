import Champ, { CHAMP_IMAGE_SIZE } from "./Champ";

function Champs({ champs }) {
    return (
        <div
            style={{
                display: "grid",
                gridAutoFlow: "row",
                gridGap: 12,
                gridTemplateColumns: `repeat(auto-fill, ${CHAMP_IMAGE_SIZE}px)`,
                justifyContent: "center",
            }}>
            {champs.map((champ) => (
                <Champ key={champ.name} champ={champ} />
            ))}
        </div>
    );
}

export default Champs;
