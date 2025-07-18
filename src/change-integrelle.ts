import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

const MAP = {
	handFan: 30,
	iceCream: 25,
	fan: 20,
	harmonica: 18,
	fishing: 17,
	doubleChips: 16,
	chips: 15,
	scarf: 14,
	choco: 13,
	lying: 115,
	haunt: 10,
	drawing: 9,
	cake: 8,
	drinkling: 103,
	raincoat: 86,
	underBrella: 82,
	ghost: 89,
	spring: 90,
	lethal: 91,
	drink: 92,
	cold: 93,
	christmas: 94,
	float: 95,
	floatHappy: 96,
	spooky: 98,
	raincoatOld: 99,
	brella: 101
};

function randomElement(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

interface Params {
	reset: boolean;
	set: string;
}

const script: Firebot.CustomScript<Params> = {
	getScriptManifest: () => {
		return {
			name: "Integrelle's Closet",
			description: "Change the look of Integrelle.",
			author: "NorthWestWind",
			version: "1.0",
			firebotVersion: "5",
		};
	},
	getDefaultParameters: () => {
		return {
			reset: {
				type: "boolean",
				default: false,
				description: "Reset Integrelle's look.",
			},
			set: {
				type: "string",
				default: "",
				description: "Integrelle's new (old) look. Leave empty for random.",
			},
		};
	},
	/// @ts-ignore
	run: (runRequest) => {
		if (runRequest.parameters.reset) runRequest.parameters.set = Array.from(Object.keys(MAP))[0];
		else if (!runRequest.parameters.set) runRequest.parameters.set = randomElement(Array.from(Object.keys(MAP)).slice(1));
		else if (!(MAP as any)[runRequest.parameters.set]) return { success: true, effects: [] };
		const sources = Array.from(Object.entries(MAP)).map(([key, val]) => ({
			sceneName: "Switch",
			sourceId: val,
			groupName: "Integrelle",
			action: key == runRequest.parameters.set
		}));
		runRequest.modules.customVariableManager.addCustomVariable("currentIntegrelle", runRequest.parameters.set);
		return {
			success: true,
			effects: [
				{
					type: "ebiggz:obs-toggle-source-visibility",
					selectedSources: sources.filter(x => !x.action)
				},
				{
					type: "firebot:delay",
					delay: "1"
				},
				{
					type: "ebiggz:obs-toggle-source-visibility",
					selectedSources: sources.filter(x => x.action)
				}
			],
		};
	},
};

export default script;
