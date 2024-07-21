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
    if (!isEnglish(runRequest.parameters.message))
      runRequest.modules.customVariableManager.addCustomVariable("isLastNonEng", 1, 1);
    else
      runRequest.modules.customVariableManager.addCustomVariable("isLastNonEng", "", 1);
    return {
      success: true,
      effects: []
    };
  },
};

export default script;
