import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { existsSync, readFileSync, writeFileSync } from "fs";

interface Params {
	path: string;
	output: string;
}

const script: Firebot.CustomScript<Params> = {
	getScriptManifest: () => {
		return {
			name: "IPC Reader",
			description: "Read a file's first line and output the array to a custom variable for IPC purposes.",
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
			output: {
				type: "string",
				default: "ipc",
				description: "Custom variable to output to",
			},
		};
	},
	run: (runRequest) => {
		if (!runRequest.parameters.path || !runRequest.parameters.output) return {
			success: true,
			effects: []
		};
		if (!existsSync(runRequest.parameters.path)) return { success: true, effects: [] };
		const content = readFileSync(runRequest.parameters.path, { encoding: "utf8" });
		const lines = content.split("\n");
		const originalLength = lines.length;
		while (lines.length) {
			const line = lines.shift()!;
			if (line) {
				runRequest.modules.customVariableManager.addCustomVariable(runRequest.parameters.output, line.split(/\s+/g));
				break;
			}
		}
		if (lines.length != originalLength) writeFileSync(runRequest.parameters.path, lines.join("\n"));
		return { success: true, effects: [] };
	},
};

export default script;
