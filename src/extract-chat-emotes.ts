import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

type TwitchEmote = {
	id: string;
  name: string;
  images: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  },
  tier: string;
  emote_type: string;
  emote_set_id: string;
  format: ("static" | "animated")[];
  scale: string[];
  theme_mode: ("light" | "dark")[];
}

type BTTVEmote = {
	id: string;
	code: string;
	imageType: string;
	animated: boolean;
	userId: string;
}

// I'm getting the emotes using Firebot HTTP Request, and then write them into custom variables
// BTTV: https://api.betterttv.net/3/cached/users/twitch/$userId[$streamer] write only the "channelEmotes" object
// Twitch: https://api.twitch.tv/helix/chat/emotes?broadcaster_id=$userId[$streamer] (include Twitch auth header) write only the "data" object
interface Params {
  chatMessage: string;
	bttvEmotes: string;
	twitchEmotes: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Extract Chat Emotes",
      description: "Extract all emotes from a chat message.",
      author: "NorthWestWind",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      chatMessage: {
        type: "string",
        default: "$chatMessage",
        description: "Chat message to process",
      },
			bttvEmotes: {
				type: "string",
				default: "$customVariable[bttvEmotes]",
				description: "Fetched BTTV emotes"
			},
			twitchEmotes: {
				type: "string",
				default: "$customVariable[twitchEmotes]",
				description: "Fetched Twitch emotes"
			}
    };
  },
	/// @ts-ignore
  run: (runRequest) => {
		if (!runRequest.parameters.chatMessage || !runRequest.parameters.twitchEmotes || !runRequest.parameters.bttvEmotes) return {
			success: true,
			effects: [
				{
					type: "firebot:customvariable",
					active: true,
					ttl: 0,
					name: "lastChatEmotes",
					variableData: "[]"
				}
			]
		};
		try {
			const twitchEmotes = JSON.parse(runRequest.parameters.twitchEmotes) as TwitchEmote[];
			const bttvEmotes = JSON.parse(runRequest.parameters.bttvEmotes) as BTTVEmote[];
			const emotes: { type: "twitch" | "bttv", code: string }[] = [];
			const set = new Set<string>();
			for (const emote of twitchEmotes)
				if (runRequest.parameters.chatMessage.includes(emote.name))
					set.add(emote.name);
			set.forEach(e => emotes.push({ type: "twitch", code: e }));
			set.clear();
			for (const emote of bttvEmotes)
				if (runRequest.parameters.chatMessage.includes(emote.code))
					set.add(emote.code);
			set.forEach(e => emotes.push({ type: "twitch", code: e }));
			return {
				success: true,
				effects: [
					{
						type: "firebot:customvariable",
						active: true,
						ttl: 0,
						name: "lastChatEmotes",
						variableData: JSON.stringify(emotes)
					}
				]
			};
		} catch (err) {
			return {
				success: true,
				effects: [
					{
						type: "firebot:customvariable",
						active: true,
						ttl: 0,
						name: "lastChatEmotes",
						variableData: "[]"
					}
				]
			};
		}
  },
};

export default script;
