import { ClientArguments } from "@rbxts/shared";

declare const NLS: (source: string, parent: Instance | undefined, ...arguments: unknown[]) => LuaSourceContainer;

const CLIENT_SOURCE = script.Parent!.GetAttribute("ClientLoaderSource") as string;
script.Parent!.SetAttribute("ClientLoaderSource", undefined);

const HttpService = game.GetService("HttpService");

/**
 * Executes code on the client. Please be aware of the following:
 * - `script` refers to a ModuleScript, and the hierarchy is structured as: nil -> Model [name = "DataModel"] -> ModuleScript.
 * - Functions from your environment that create scripts (e.g., NewScript, NewLocalScript, NewModuleScript) are not supported.
 * - Network-serializable arguments can be passed as environment variables.
 * - This function resolves only when the client interacts with the RemoteFunction used to transmit ClientArguments.
 *
 * @see ClientArguments
 */
export const loadClientCode = (player: Player, clientArguments: ClientArguments) => {
	return new Promise<LuaSourceContainer>((resolve) => {
		const name = HttpService.GenerateGUID(true);

		// eslint-disable-next-line prefer-const
		let localScript: LuaSourceContainer;

		const fn: RemoteFunction<() => ClientArguments> = new Instance("RemoteFunction");
		fn.Name = name;
		fn.OnServerInvoke = (invoker) => {
			if (invoker !== player) return undefined;

			fn.OnServerInvoke = () => {};
			player.SetAttribute("getClientArgumentsName", undefined);

			task.delay(0.25, () => fn.Destroy());
			task.defer(resolve, localScript);

			return clientArguments;
		};

		fn.Parent = player;

		player.SetAttribute("getClientArgumentsName", name);

		localScript = NLS(
			CLIENT_SOURCE,
			player.FindFirstChildOfClass("PlayerGui") ??
				player.FindFirstChildOfClass("Backpack") ??
				new Instance("Backpack", player),
			fn,
		);
	});
};
