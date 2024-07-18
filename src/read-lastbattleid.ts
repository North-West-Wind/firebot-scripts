import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { existsSync, readFileSync } from "fs";

interface Params {
	path: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Read LastBattleId",
      description: "Read LastBattleId from a file.",
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
        description: "Path to persistent file",
      },
    };
  },
	/// @ts-ignore
  run: (runRequest) => {
		if (!runRequest.parameters.path) return {
			success: true,
			effects: []
		};
		if (!existsSync(runRequest.parameters.path)) return { success: true, effects: [] };
		const id = readFileSync(runRequest.parameters.path, { encoding: "utf8" });
		if (!id) return { success: true, effects: [] };
		return {
			success: true,
			effects: [
				{
					type: "firebot:customvariable",
					ttl: 0,
					name: "lastBattleId",
					variableData: id.trim(),
				},
			]
		}
  },
};

export default script;
