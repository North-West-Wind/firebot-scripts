import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import moment from "moment";

function commitId() {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
	let id = "";
	for (let ii = 0; ii < 8; ii++)
		id += chars[Math.floor(Math.random() * chars.length)];
	return id;
}

function momentMinusMinutes(minutesInChannel: number) {
	return moment().subtract(minutesInChannel * Math.random(), "minute").format("YYYY-MM-DD HH:mm:ss ZZ");
}

const script: Firebot.CustomScript<{}> = {
  getScriptManifest: () => {
    return {
      name: "Fake git blame",
      description: "Create a fake line of git blame.",
      author: "NorthWestWind",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
    };
  },
  run: async (runRequest) => {
		const users = (await runRequest.modules.userDb.getOnlineUsers()).filter(user => user.chatMessages).sort((a, b) => b.minutesInChannel - a.minutesInChannel);
		if (!users.length) return {
			success: true, effects: [{
				type: "firebot:chat",
				chatter: "Bot",
				message: `fatal: there's no one northw35Awk`
			}]
		};
		const all = users.map(user => user.minutesInChannel).reduce((a, b) => a + b);
		let rng = Math.random() * all;
		for (const user of users) {
			rng -= user.minutesInChannel;
			runRequest.modules.logger.debug(`${rng} ${user.twitchRoles}`);
			if (rng < 0) {
				return {
					success: true, effects: [{
						type: "firebot:chat",
						chatter: "Bot",
						message: `${commitId()} (${user.username} ${momentMinusMinutes(user.minutesInChannel)} ${Math.floor(Math.random() * user.chatMessages) + 1}) git blamed lmao`
					}]
				}
			}
		}
		return {
			success: true, effects: [{
				type: "firebot:chat",
				chatter: "Bot",
				message: `fatal: i'm having a headache northw35Mad`
			}]
		};
  },
};

export default script;
