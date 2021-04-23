import fs from "fs";

let config = {};
fs.readFile("./server/config/.config.env", "utf8", (error, data) => {
    if (!error) {
        config = JSON.parse(data);
    }
});

export function getConfig(configName) {
    return process.env[configName] || config[configName];
}
