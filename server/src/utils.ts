declare const NLS: (source: string, parent: Instance | undefined, ...arguments: unknown[]) => void;

const CLIENT_SOURCE = script.Parent!.GetAttribute("ClientLoaderSource") as string;
script.SetAttribute("ClientLoaderSource", undefined);

const HttpService = game.GetService("HttpService");

/**
 Running code on the client is possible, but please note:
 - script = ModuleScript and the hierarchy looks like this: nil -> Model [name = "DataModel"] -> ModuleScript
 - Functions from your environment that create scripts will not work (NewScript, NewLocalScript, NewModuleScript)
 - Network serializable arguments can be passed in the form of an environment variable.
**/
export const loadClientCode = <T>(player: Player, clientArguments: T) => {
	return new Promise<void>((resolve) => {
		const name = HttpService.GenerateGUID(true);
		
		const fn: RemoteFunction<() => T> = new Instance("RemoteFunction");
		fn.Name = name;
		fn.OnServerInvoke = (invoker) => {
			if (invoker !== player) return undefined;

			fn.OnServerInvoke = () => {};
			player.SetAttribute("getClientArgumentsName", undefined);

			task.delay(0.25, () => fn.Destroy());
			task.defer(resolve);

			return clientArguments;
		};

		fn.Parent = player;

		player.SetAttribute("getClientArgumentsName", name);
		NLS(CLIENT_SOURCE, player.FindFirstChildOfClass("PlayerGui") ?? player.FindFirstChildOfClass("Backpack"), fn);
	});
};
