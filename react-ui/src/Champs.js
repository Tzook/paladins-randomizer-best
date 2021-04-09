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
                maxWidth: "1200px",
                margin: "auto",
            }}>
            {champs.map((champ) => (
                <Champ key={champ.name} champ={champ} />
            ))}
        </div>
    );
}

export default Champs;
