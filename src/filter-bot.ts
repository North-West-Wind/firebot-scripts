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

		const bonk = {
			type: "firebot:playsound",
      soundType: "local",
      volume: 10,
      audioOutputDevice: {
          label: "Output: SFX",
          deviceId: "72884fe6ce9d7a76d059cf77b53963b476a835632df13919b8364471a7659cd6"
      },
      filepath: "/home/northwestwind/Music/stream/effects/bonk/bonk.opus",
      folder: "/home/northwestwind/Music/stream/effects/bonk",
		};

		// Check for phrases like "cheap viewer" and "best viewer"
		let norm: string = supernormalize(runRequest.parameters.message);
		const phrases = ["cheap v1ewer", "best v1ewer"];
		if (phrases.some(ph => norm.includes(ph)))
			return { success: true, effects: [{
				type: "firebot:delete-chat-message"
			}, bonk] };
		// Check for format of "host .tld @8lEtTeRs"
		else if (/@\w{8}$/.test(runRequest.parameters.message)) {
			// Convert "d0t" to "."
			norm = norm.replace(/\Wd0t\W/g, ".");
			// Match anything that looks like a link
			if (/(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/.test(norm))
				return { success: true, effects: [{
					type: "firebot:delete-chat-message"
				}, bonk] };
		}
		return { success: true, effects: [] };
	},
};

export default script;
