import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import parse from "parse-duration";

interface Params {
	humantime: string
}

const script: Firebot.CustomScript<Params> = {
	getScriptManifest: () => {
		return {
			name: "Delay Huamntime",
			description: "Delay an amount of time specified in humantime format.",
			author: "NorthWestWind",
			version: "1.0",
			firebotVersion: "5",
		};
	},
	getDefaultParameters: () => {
		return {
			humantime: {
				type: "string",
				default: "",
				description: "Time to delay for.",
			},
		};
	},
	/// @ts-ignore
	run: (runRequest) => {
		const time = parse(runRequest.parameters.humantime);
		if (!time) return {
			success: false,
			effects: [{
				type: "firebot:chat",
				chatter: "Bot",
				message: "*even more confused summatia noises*",
			}]
		}
		return {
			success: true,
			effects: [
				{
					type: "firebot:delay",
					delay: time / 1000
				}
			],
		};
	},
};

export default script;
