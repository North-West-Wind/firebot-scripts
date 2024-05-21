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
  /// @ts-ignore
  run: (runRequest) => {
    // ideally i want to set a custom variable, but it is not supported here
    // so instead, i have 2 effect lists which set and unset the variable "tmp"
    if (!isEnglish(runRequest.parameters.message)) return {
      success: true,
      effects: [
        {
          type: "firebot:customvariable",
          active: true,
          ttl: 1,
          name: "isLastNonEng",
          variableData: "1"
        }
      ]
    };
    else return {
      success: true,
      effects: [
        {
          type: "firebot:customvariable",
          active: true,
          ttl: 1,
          name: "isLastNonEng",
          variableData: ""
        }
      ]
    };
  },
};

export default script;
