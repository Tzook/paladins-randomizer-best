import { getChampFileName } from "./get-champs.mjs";
import fs from "fs";
import _ from "lodash";

const roles = {};

/**
 * @param {{
 * name: string,
 * role: string,
 * image: string,
 * }} champ
 */
export async function addChamp(champ) {
    fs.readFile(getChampFileName(champ.name), (error, data) => {
        if (error) {
            return console.error(`Had an error loading champ json: '${champ.name}'`);
        }
        const champJson = JSON.parse(data);
        const champFormatted = formatChamp(champ, champJson);
        roles[champFormatted.role] = roles[champFormatted.role] || [];
        roles[champFormatted.role].push(champFormatted);
    });
}

export function getRandomAnyChamps(amount) {
    const availableChamps = _.flatten(Object.values(roles));
    return _.sampleSize(availableChamps, amount);
}

/**
 *
 * @param {{
 * name: string,
 * role: string,
 * image: string,
 * }} champ
 * @param {[{
 * cards: [{
 * card_description: string,
 * card_name: string,
 * championCard_URL: string,
 * rarity: "Common"|"Legendary",
 * }]
 * }]} champJson
 */
function formatChamp(champ, champJson) {
    return {
        name: champ.name,
        role: champ.role,
        image: champ.image,
        talents: champJson[0].cards
            .filter((talent) => talent.rarity === "Legendary")
            .map((talent) => ({
                name: talent.card_name,
                description: talent.card_description,
                image: talent.championCard_URL,
            })),
    };
}
