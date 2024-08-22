import { readFileSync } from "fs";

import stripJsonComments from "strip-json-comments";

const jsonWithComments = readFileSync("src/settings.json", "utf8");
const jsonWithoutComments = stripJsonComments(jsonWithComments);
export const settings = JSON.parse(jsonWithoutComments);
