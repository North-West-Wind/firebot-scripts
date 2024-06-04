import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
	url: string;
  message: string;
	user: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Summatia Speak",
      description: "Create a safe POST request for Summatia API.",
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
      url: {
        type: "string",
        default: "",
        description: "Summatia API",
      },
      user: {
        type: "string",
        default: "$user",
        description: "User who made this message",
      },
    };
  },
	/// @ts-ignore
  run: (runRequest) => {
		if (!runRequest.parameters.message || !runRequest.parameters.url || !runRequest.parameters.user) return {
			success: true,
			effects: []
		};
		const replaced = runRequest.parameters.message.replace(/スマシア/g, "Summatia");
		return {
			success: true,
			effects: [
				{
					type: "firebot:http-request",
					active: true,
					headers: [
						{
							key: "Content-Type",
							value: "application/json"
						}
					],
					method: "POST",
					url: runRequest.parameters.url,
					body: JSON.stringify({ name: runRequest.parameters.user, platform: "Twitch", message: replaced })
				}
			]
		};
  },
};

export default script;
