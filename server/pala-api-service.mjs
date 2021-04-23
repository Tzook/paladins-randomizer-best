import { getConfig } from "./config/config.mjs";
import fetch from "node-fetch";
import dateformat from "dateformat";
import md5 from "md5";

const PALADINS_API_BASE_URL = "http://api.paladins.com/paladinsapi.svc/";
const SESSION_DURATION = 1000 * 60 * 14;

let sessionResponseDoNotUseThisOne = null;
let sessionIdDoNotUseThisOne = null;
async function getSessionId() {
    if (!sessionResponseDoNotUseThisOne) {
        sessionIdDoNotUseThisOne = null;
        sessionResponseDoNotUseThisOne = createSession();
    }
    const sessionId = await sessionResponseDoNotUseThisOne;
    sessionIdDoNotUseThisOne = sessionId;
    return sessionId;
}

export async function fetchPlayerDetails(playerName) {
    return getDataApi("getplayer", playerName);
}

export async function fetchPlayerChamps(playerName) {
    return getDataApi("getchampionranks", playerName);
}

export async function fetchAllChamps() {
    return getDataApi("getchampions", 1);
}

export async function fetchAllChampsCards() {
    return getDataApi("getitems", 1);
}

async function getDataApi(apiMethodName, ...params) {
    const sessionId = await getSessionId();
    if (!sessionId) {
        return console.error("oops, no sessionId");
    }
    const dataResponse = await fetchApi(apiMethodName, "/" + params.join("/"));
    return dataResponse;
}

async function createSession() {
    const sessionResponse = await fetchApi("createsession");
    if (sessionResponse.session_id) {
        setTimeout(() => (sessionResponseDoNotUseThisOne = null), SESSION_DURATION);
    }
    return sessionResponse.session_id;
}

function createSignature(apiMethodName, time) {
    const devId = getConfig("palaApiDevId");
    const authkey = getConfig("palaApiAuthKey");
    const signature = md5(`${devId}${apiMethodName}${authkey}${time}`);
    return signature;
}

async function fetchApi(apiMethodName, additionalData = "") {
    const devId = getConfig("palaApiDevId");
    const time = dateformat(new Date(), "yyyymmddHHMMss", true);
    const signature = createSignature(apiMethodName, time);

    let url = `${PALADINS_API_BASE_URL}${apiMethodName}json/${devId}/${signature}${
        sessionIdDoNotUseThisOne ? "/" + sessionIdDoNotUseThisOne : ""
    }/${time}${additionalData}`;
    return fetch(url)
        .then((res) => res.json())
        .catch((error) => {
            console.error("Had an fetching api", error);
            return Promise.reject();
        });
}

export async function test() {
    setTimeout(() => {
        // fetchAllChampsCards();
    }, 100);
}

// Data to get:
// Wins / (Wins + Losses) %
// Title
// Level
// AvatarURL?
// Name
// LastPlayed
// Champs locked // + Levels + WR per champ + LastPlayed
