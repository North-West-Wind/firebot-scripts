import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { existsSync, readFileSync } from "fs";

interface Params {
	path: string;
	regex: string;
	flags: string;
	output: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Grep File",
      description: "Check if a regex matches in a file.",
      author: "NorthWestWind",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      path: {
        type: "string",
        default: "",
        description: "Path to file",
      },
      regex: {
        type: "string",
        default: "",
        description: "Regex to match",
      },
      flags: {
        type: "string",
        default: "",
        description: "Regex flags",
      },
      output: {
        type: "string",
        default: "",
        description: "Custom variable to output to",
      },
    };
  },
  run: (runRequest) => {
		if (!runRequest.parameters.path || !runRequest.parameters.regex || !runRequest.parameters.output) return {
			success: true,
			effects: []
		};
		if (!existsSync(runRequest.parameters.path)) return { success: true, effects: [] };
		const content = readFileSync(runRequest.parameters.path, { encoding: "utf8" });
		if (!new RegExp(runRequest.parameters.regex, runRequest.parameters.flags).test(content)) return { success: true, effects: [] };
		runRequest.modules.customVariableManager.addCustomVariable(runRequest.parameters.output, content);
		return { success: true, effects: [] };
  },
};

export default script;
