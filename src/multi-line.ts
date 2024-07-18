import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

interface Params {
  message: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Multi-line",
      description: "Send something with multi-line using multiple messages.",
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
        description: "Chat message",
      },
    };
  },
	/// @ts-ignore
  run: (runRequest) => {
		if (!runRequest.parameters.message) return {
			success: true,
			effects: []
		};
		let effects: Effects.Effect[] = [];
		for (const line of runRequest.parameters.message.split("{n}"))
			effects.push({
				type: "firebot:chat",
				chatter: "Bot",
				message: line,
			});
		return {
			success: true,
			effects
		};
  },
};

export default script;
