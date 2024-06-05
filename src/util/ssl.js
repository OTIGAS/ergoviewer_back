import { readdirSync, statSync } from "fs";

import { dirname } from "path"
import { fileURLToPath  } from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))

export function certs(name) {
  const dir = __dirname + "/../../../../ssl/certs/";

  const files = readdirSync(dir);
  var certs = [];

  files
    .map((fileName) => ({
      name: fileName,
      time: statSync(`${dir}/${fileName}`).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)
    .map((file) => {
      if (file.name.startsWith(name) && !file.name.includes(".cache")) certs.push(file.name);
    });
  return certs[0];
}
export function keys(name) {
  const dir = __dirname + "/../../../../ssl/keys/";

  const files = readdirSync(dir);
  var keys = [];

  files
    .map((fileName) => ({
      name: fileName,
      time: statSync(`${dir}/${fileName}`).mtime.getTime(),
    }))
    .sort((a, b) => a.time - b.time)
    .map((file) => {
      if (file.name.startsWith(name.split("_")[4] + "_" + name.split("_")[5]))
        keys.push(file.name);
    });
  return keys[0];
}