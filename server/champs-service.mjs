import { fetchAllChamps, fetchAllChampsCards } from "./pala-api-service.mjs";
import _ from "lodash";

export const ROLE_FRONTLINE = "Frontline";
export const ROLE_SUPPORT = "Support";
export const ROLE_DAMAGE = "Damage";
export const ROLE_FLANK = "Flank";

const roles = {};
const champsById = {};
export const lockableChamps = {};
const ROLE_TO_DATA = {
    [ROLE_FRONTLINE]: "Paladins Front Line",
    [ROLE_SUPPORT]: "Paladins Support",
    [ROLE_DAMAGE]: "Paladins Damage",
    [ROLE_FLANK]: "Paladins Flanker",
};

export async function loadAllChamps() {
    const [allChamps, allCards] = await Promise.all([fetchAllChamps(), fetchAllChampsCards()]);
    if (!allChamps || !allChamps.length) {
        console.error("Failed to load all champs", allChamps);
        return;
    }
    for (const champ of allChamps) {
        const champFormatted = {
            name: champ.Name,
            role: champ.Roles,
            image: champ.ChampionIcon_URL,
            id: champ.id,
            talents: [],
        };
        if (!(champ.OnFreeRotation || champ.OnFreeWeeklyRotation)) {
            lockableChamps[champFormatted.name] = true;
        }
        roles[champFormatted.role] = roles[champFormatted.role] || [];
        roles[champFormatted.role].push(champFormatted);
        champsById[champFormatted.id] = champFormatted;
    }
    if (!allCards || !allCards.length) {
        console.error("Failed to load all champs cards", allCards);
        return;
    }
    for (const card of allCards) {
        if (card.item_type !== "Inventory Vendor - Talents") {
            continue;
        }
        const champ = champsById[card.champion_id];
        champ.talents.push({
            name: card.DeviceName,
            description: card.Description,
            image: card.itemIcon_URL.replace("champion-cards", "champion-legendaries-badge").replace("jpg", "png"),
            level: card.talent_reward_level,
        });
    }
    console.log("Successfully loaded all champs");
}

export function getRandomChamp(settings, blacklist) {
    let availableChamps = [];
    for (let roleName in ROLE_TO_DATA) {
        if (settings[roleName].value) {
            const roleData = ROLE_TO_DATA[roleName];
            for (const champ of roles[roleData]) {
                if (!blacklist[champ.name]) {
                    availableChamps.push(champ);
                }
            }
        }
    }
    return _.sample(availableChamps);
}

export function getAllChamps() {
    return _.sortBy(_.flatten(Object.values(roles)), "name");
}
