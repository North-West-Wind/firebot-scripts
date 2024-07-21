import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
}

const COUNTER_MAP: { [key: string]: string } = {
	spygadget: "dfd4bd3f-7142-4634-ac30-820fff29dd04", // vunder
	spygadget_sorella: "9268c6e0-95ce-4b0f-9f98-7a55d8580516", // sunder
	parashelter: "c5bba387-388c-4de8-a7b9-423beaf08bca", // vbrella
	parashelter_sorella: "2c91181b-09d2-48ce-937b-a41d6bce4502", // sbrella
	order_shelter_replica: "eed2b15d-468a-43f2-af01-51c50d196102", // order brella
	campingshelter: "c16976fd-632d-4e6c-b547-d70006805f6b", // vtent
	campingshelter_sorella: "53741986-e409-40c2-b63f-884dff423f4a", // stent
	brella24mk1: "13078f36-ea47-43ea-82b4-a6bd7a046bee", // recycled 1
	brella24mk2: "e903d841-343e-4749-8df6-3100951d078d", // recycled 2,

	games: "0f3fb760-e083-424e-8aa2-956ed7c4e1ca",
	games_today: "59f01530-44f4-11ef-a955-5dd299300680",
	brellas: "f9527f91-5793-4204-b32c-047afcb87c1f",
	brellas_today: "adddd733-452c-4a0a-af4b-d0bbaa9f9a51",
	our_brellas: "ac82866b-83f3-443f-9f74-821c94f94876",
	other_brellas: "b84df340-44f4-11ef-a955-5dd299300680"
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Count Brellas",
      description: "Count the aount of Brellas.",
      author: "NorthWestWind",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
    };
  },
	/// @ts-ignore
  run: (runRequest) => {
		const splatlog = runRequest.modules.customVariableManager.getCustomVariable("splatlog");
		if (!splatlog) return {
			success: true,
			effects: []
		};
		let brellas: { [key: string]: number } = {
			spygadget: 0, // vunder
			spygadget_sorella: 0, // sunder
			parashelter: 0, // vbrella
			parashelter_sorella: 0, // sbrella
			order_shelter_replica: 0, // order brella
			campingshelter: 0, // vtent
			campingshelter_sorella: 0, // stent
			brella24mk1: 0, // recycled 1
			brella24mk2: 0, // recycled 2
		}
		let ourBrellas = 0, otherBrellas = 0;
		const our = splatlog.our_team_members;
		our.forEach((member: any) => {
			if (member.me || member.weapon.type.key != "brella") return;
			ourBrellas++;
			if (brellas[member.weapon.key] !== undefined) brellas[member.weapon.key]++;
		});
		const their = splatlog.their_team_members;
		their.forEach((member: any) => {
			if (member.weapon.type.key != "brella") return;
			otherBrellas++;
			if (brellas[member.weapon.key] !== undefined) brellas[member.weapon.key]++;
		});
		if (splatlog.third_team_members) {
			const third = splatlog.third_team_members;
			third.forEach((member: any) => {
				if (member.weapon.type.key != "brella") return;
				otherBrellas++;
				if (brellas[member.weapon.key] !== undefined) brellas[member.weapon.key]++;
			});
		}

		let effects: any[] = [];
		for (const brella in brellas) {
			if (!brellas[brella]) continue;
			effects.push({
				type: "firebot:update-counter",
				value: brellas[brella],
				counterId: COUNTER_MAP[brella],
				mode: "increment"
			});
		}
		for (const suffix of ["", "_today"]) {
			effects.push({
				type: "firebot:update-counter",
				value: Array.from(Object.values(brellas)).reduce((a, b) => a + b),
				counterId: COUNTER_MAP["brellas" + suffix],
				mode: "increment"
			});
		}
		effects.push({
			type: "firebot:update-counter",
			value: ourBrellas,
			counterId: COUNTER_MAP.our_brellas,
			mode: "increment"
		});
		effects.push({
			type: "firebot:update-counter",
			value: otherBrellas,
			counterId: COUNTER_MAP.other_brellas,
			mode: "increment"
		});
		return {
			success: true,
			effects
		};
  },
};

export default script;
