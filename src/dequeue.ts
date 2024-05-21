import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
	queue: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Dequeue",
      description: "Delete an object from the queue.",
      author: "NorthWestWind",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
			queue: {
				type: "string",
				default: "[]",
				description: "Previous queue"
			}
    };
  },
	/// @ts-ignore
  run: (runRequest) => {
		if (!runRequest.parameters.queue) runRequest.parameters.queue = "[]";
		try {
			const queue = JSON.parse(runRequest.parameters.queue) as any[];
			const obj = queue.shift();
			return {
				success: true,
				effects: [
					{
						type: "firebot:customvariable",
						active: true,
						ttl: 0,
						name: "queue",
						variableData: JSON.stringify(queue)
					},
					{
						type: "firebot:customvariable",
						active: true,
						ttl: 0,
						name: "dequeue",
						variableData: JSON.stringify(obj)
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
