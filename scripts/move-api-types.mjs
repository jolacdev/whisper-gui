import fs from "fs";

const SOURCE_PATH = "./temp/pyflow/types/api/api/index.d.ts";
const DESTINATION_PATH = "./frontend/src/types/pywebview/";
const FILE_NAME = "pywebview-api.d.ts";

fs.mkdirSync(DESTINATION_PATH, { recursive: true });
fs.renameSync(SOURCE_PATH, `${DESTINATION_PATH}${FILE_NAME}`);
