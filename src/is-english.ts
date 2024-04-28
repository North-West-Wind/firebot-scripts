import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
const isEnglish = require("is-english");

interface Params {
  message: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Is English",
      description: "Check if string is English.",
      author: "NorthWestWind",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      message: {
        type: "string",
        default: "",
        description: "Chat Message",
      },
    };
  },
  run: (runRequest) => {
    // ideally i want to set a custom variable, but it is not supported here
    // so instead, i have 2 effect lists which set and unset the variable "tmp"
    if (!isEnglish(runRequest.parameters.message)) return {
      success: true,
      effects: [
        {
          type: "firebot:run-effect-list",
          listType: "preset",
          presetListId: "8e1a9900-0513-11ef-b4f9-f9bd9ba0ce84"
        }
      ]
    };
    else return {
      success: true,
      effects: [
        {
          type: "firebot:run-effect-list",
          listType: "preset",
          presetListId: "a776e840-0513-11ef-b4f9-f9bd9ba0ce84"
        }
      ]
    };
  },
};

export default script;
