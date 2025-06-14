import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

const script: Firebot.CustomScript<{ message: string }> = {
	getScriptManifest: () => {
		return {
			name: "Temperature",
			description: "Convert Fahrenheit to Celsius and vice versa.",
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
			}
		};
	},
	run: async (runRequest) => {
		const regex = /(?![a-z])-?\d+(\.\d+)?°?(c|f)(?![a-z])/gi;
		const matches = regex.exec(runRequest.parameters.message);
		if (!matches) return { success: true, effects: [] };
		const temperature = matches[0].trim().replace("°", "").toLowerCase();
		const num = parseFloat(temperature.slice(0, temperature.length - 1));
		if (isNaN(num)) return { success: true, effects: [] };
		let message: string;
		if (temperature.endsWith("c")) {
			const fahrenheit = Math.round((num * 1.8 + 32) * 100) * 0.01;
			message = `${num}°C = ${fahrenheit}°F`;
		} else {
			const celsius = Math.round((num - 32) * 100 / 1.8) * 0.01;
			const kelvin = celsius + 273.15;
			message = `${num}°F = ${celsius}°C (${kelvin}K${kelvin < 0 ? ", impossible!" : ""})`;
		}
		return {
			success: true, effects: [{
				type: "firebot:chat",
				chatter: "Bot",
				message
			}]
		};
	},
};

export default script;
