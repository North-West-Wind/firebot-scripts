import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { supernormalize } from "supernormalize";

interface Params {
	message: string;
}

const script: Firebot.CustomScript<Params> = {
	getScriptManifest: () => {
		return {
			name: "Filter Bot",
			description: "Filter \"cheap viewer\" messages.",
			author: "NorthWestWind",
			version: "1.0",
			firebotVersion: "5",
		};
	},
	getDefaultParameters: () => {
		return {
			message: {
				type: "string",
				default: "$chatMessage",
				description: "Chat message",
			},
		};
	},
	///@ts-ignore
	run: async (runRequest) => {
		if (!runRequest.parameters.message) return {
			success: true,
			effects: []
		};

		/*if (homoglyph.search(runRequest.parameters.message, ["cheap viewer", "best viewer"]))*/
		const norm = supernormalize(runRequest.parameters.message);
		const phrases = ["cheap v1ewer", "best v1ewer"];
		if (phrases.some(ph => norm.includes(ph)))
			return { success: true, effects: [{
				type: "firebot:delete-chat-message"
			}] };
		else
			return { success: true, effects: [] };
	},
};

export default script;
