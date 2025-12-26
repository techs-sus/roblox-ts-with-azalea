declare const NLS: (source: string, parent: Instance | undefined, ...arguments: unknown[]) => void;

const CLIENT_SOURCE = script.Parent!.GetAttribute("ClientLoaderSource") as string;
script.SetAttribute("ClientLoaderSource", undefined);

/**
 Running code on the client is possible, but please note:
 - script = ModuleScript and script.Parent = nil
 - Functions from your environment that create scripts will not work (NewScript, NewLocalScript, NewModuleScript)
 - Network serializable arguments can be passed in the form of an environment variable.
**/
export const loadClientCode = <T>(player: Player, clientArguments: T) => {
	return new Promise<void>((resolve) => {
		const fn: RemoteFunction<() => T> = new Instance("RemoteFunction");
		fn.Name = "getClientArguments";
		fn.OnServerInvoke = (invoker) => {
			if (invoker !== player) return undefined;

			fn.OnServerInvoke = () => {};
			task.defer(pcall, () => fn.Destroy());
			task.defer(() => resolve());

			return clientArguments;
		};

		fn.Parent = player;

		NLS(CLIENT_SOURCE, player.FindFirstChildOfClass("PlayerGui") ?? player.FindFirstChildOfClass("Backpack"), fn);
	});
};
