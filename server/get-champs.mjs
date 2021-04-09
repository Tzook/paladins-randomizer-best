import fetch from "node-fetch";
import fs from "fs";
import { resolve } from "path";
import { addChamp } from "./champs-service.mjs";

const CHAMPS_URL = "https://cms.paladins.com/wp-json/api/champion-hub/1";
const CHAMP_BASE_URL = "https://cms.paladins.com/wp-json/wp/v2/champions?lang_id=1&slug=";
const CHAMPS_BASE_FOLDER = resolve("./server/champs");

export function crawlChamps() {
    fetch(CHAMPS_URL)
        .then((res) => res.json())
        .then((json) => fillChamps(json))
        .catch((error) => {
            console.error("Had an error getting champs", error);
            // TODO load backup?
        });
}

/**
 * @param {[{
//  * id: number,
//  * feName: string,
//  * title: string,
//  * feRole: string,
//  * latest: string,
 * name: string,
 * role: string,
 * image: string,
 * }]} champsJson
 */
function fillChamps(champsJson) {
    for (const champ of champsJson) {
        fs.access(getChampFileName(champ.name), (error) => {
            if (error) {
                console.log(`Need champ: '${champ.name}'`);
                crawlChamp(champ);
            } else {
                addChamp(champ);
            }
        });
    }
}

export function getChampFileName(champName) {
    return resolve(CHAMPS_BASE_FOLDER, champName + ".json");
}

function crawlChamp(champ) {
    fetch(CHAMP_BASE_URL + champ.name.replace(/ /g, "-"))
        .then((res) => res.json())
        .then((json) => fillChamp(json, champ))
        .catch((error) => console.error(`Had an error getting champ '${champName}'`, error));
}

/**
 * @param {[{
 * cards: [{
 * card_description: string,
 * card_name: string,
 * championCard_URL: string,
 * rarity: "Common"|"Legendary",
 * }]
 * }]} champJson
 */
function fillChamp(champJson, champ) {
    fs.writeFile(getChampFileName(champ.name), JSON.stringify(champJson, null, 4), () => {
        console.log(`Filled champ: '${champ.name}'`);
        addChamp(champ);
    });
}
