import Champ from "./Champ";

function Champs({ champs }) {
    return (
        <div
            style={{
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "repeat(10, 1fr)",
            }}>
            {champs.map((champ) => (
                <Champ key={champ.name} champ={champ} />
            ))}
        </div>
    );
}

export default Champs;
