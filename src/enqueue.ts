import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
  obj: string;
	queueVar: string;
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
			queueVar: {
				type: "string",
				default: "queue",
				description: "Custom variable name of the queue."
			},
    };
  },
  run: (runRequest) => {
		if (!runRequest.parameters.obj || !runRequest.parameters.queueVar) return {
			success: true,
			effects: []
		};
		try {
			const obj = JSON.parse(runRequest.parameters.obj);
			let queue = runRequest.modules.customVariableManager.getCustomVariable(runRequest.parameters.queueVar);
			if (!Array.isArray(queue)) queue = [];
			queue.push(obj);
			runRequest.modules.customVariableManager.addCustomVariable(runRequest.parameters.queueVar, queue);
		} catch (err) {
			runRequest.modules.logger.error(err);
		}
		return { success: true, effects: [] };
  },
};

export default script;
