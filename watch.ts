import { $ } from "bun";

await Promise.all([
	$`nodemon --config nodemon.shared.json` /* watches shared's out and reinstalls shared for realms */,
	$`bun run --filter "*" watch` /* roblox-ts compile watcher */,
	$`nodemon --config nodemon.json` /* watches {client,server}/out/** and compiles final payload */,
]);
