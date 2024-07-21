import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
	queueVar: string;
	outputVar: string;
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
			queueVar: {
				type: "string",
				default: "queue",
				description: "Custom variable name of the queue."
			},
			outputVar: {
				type: "string",
				default: "dequeue",
				description: "Custom variable name for the dequeue output."
			}
    };
  },
  run: (runRequest) => {
		if (!runRequest.parameters.queueVar || !runRequest.parameters.outputVar) return { success: true, effects: [] };
		try {
			let queue = runRequest.modules.customVariableManager.getCustomVariable(runRequest.parameters.queueVar);
			if (!Array.isArray(queue)) queue = [];
			const obj = queue.shift();
			runRequest.modules.customVariableManager.addCustomVariable(runRequest.parameters.queueVar, queue);
			runRequest.modules.customVariableManager.addCustomVariable(runRequest.parameters.outputVar, obj);
		} catch (err) {
			runRequest.modules.logger.error(err);
		}
		return { success: true, effects: [] };
  },
};

export default script;
