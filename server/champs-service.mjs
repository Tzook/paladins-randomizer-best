import { getChampFileName } from "./champs-crawler.mjs";
import fs from "fs";
import _ from "lodash";
import { ROLE_FRONTLINE, ROLE_SUPPORT, ROLE_DAMAGE, ROLE_FLANK } from "./socket.mjs";

const roles = {};
const ROLE_TO_DATA = {
    [ROLE_FRONTLINE]: "Paladins Front Line",
    [ROLE_SUPPORT]: "Paladins Support",
    [ROLE_DAMAGE]: "Paladins Damage",
    [ROLE_FLANK]: "Paladins Flanker",
};

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

export function getRandomAnyChamps(amount, settings) {
    let availableChamps = [];
    for (let roleName in ROLE_TO_DATA) {
        if (settings[roleName].value) {
            const roleData = ROLE_TO_DATA[roleName];
            availableChamps = availableChamps.concat(roles[roleData]);
        }
    }
    return _.sampleSize(availableChamps, amount);
}

export function getAllChamps() {
    return _.sortBy(_.flatten(Object.values(roles)), "name");
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
