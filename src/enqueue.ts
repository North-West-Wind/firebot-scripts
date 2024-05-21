import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
  obj: string;
	queue: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Enqueue",
      description: "Push an object into the queue.",
      author: "NorthWestWind",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      obj: {
        type: "string",
        default: "",
        description: "Object for queue",
      },
			queue: {
				type: "string",
				default: "[]",
				description: "Previous queue"
			}
    };
  },
	/// @ts-ignore
  run: (runRequest) => {
		if (!runRequest.parameters.obj) return {
			success: true,
			effects: []
		};
		if (!runRequest.parameters.queue) runRequest.parameters.queue = "[]";
		try {
			const obj = JSON.parse(runRequest.parameters.obj);
			const queue = JSON.parse(runRequest.parameters.queue) as any[];
			queue.push(obj);
			return {
				success: true,
				effects: [
					{
						type: "firebot:customvariable",
						active: true,
						ttl: 0,
						name: "queue",
						variableData: JSON.stringify(queue)
					}
				]
			};
		} catch (err) {
			return {
				success: true,
				effects: []
			};
		}
  },
};

export default script;
