import { $ } from "bun";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const ATTRIBUTE = "ClientLoaderSource";
const BUILD_DIRECTORY = "build";
const CLIENT_PAYLOAD_HEADER =
	'local clientArguments = assert(({...})[1] or owner:FindFirstChild("getClientArguments"), "failed getting remote function arguments"):InvokeServer()\n';

try {
	await rm(BUILD_DIRECTORY, { recursive: true, force: true });
} catch (e) {}

try {
	await mkdir(BUILD_DIRECTORY);
} catch (e) {}

const HAS_CLIENT = existsSync("client.project.json") && existsSync("src/client") && existsSync("src/client/index.ts");

console.log(HAS_CLIENT ? `Build includes client src via attribute ${ATTRIBUTE}` : "Build does not include client src");

// this script should be invoked after a build is finished
// await $`bun run build`;

// rojo searches for files in the project.json's directory
const fixPath = (p: string) => join("../", p);

const serverProjectJson = await Bun.file("default.project.json").json();
serverProjectJson.tree.$properties ??= {};
serverProjectJson.globIgnorePaths = serverProjectJson.globIgnorePaths.map(fixPath);

const recurseTree = (tree: { $path: string | undefined; [key: string]: unknown }) => {
	if (tree.$path !== undefined) tree.$path = fixPath(tree.$path);

	Object.keys(tree)
		.filter((key) => !key.startsWith("$") && typeof tree[key] === "object")
		.forEach((key) => recurseTree(tree[key]));
};

recurseTree(serverProjectJson.tree);

const build = async (rbxmPath: string, projectJsonPath: string, payloadOutPath: string) => {
	await $`rojo build -o ${rbxmPath} ${projectJsonPath} && azalea generate-full-script -i ${rbxmPath} -o ${payloadOutPath} --minify --novel`;
};

if (HAS_CLIENT) {
	// build client payload
	const clientPayloadPath = join(BUILD_DIRECTORY, "client.luau");
	await build(join(BUILD_DIRECTORY, "client.rbxm"), "./client.project.json", clientPayloadPath);

	const fullClientSource = CLIENT_PAYLOAD_HEADER + (await Bun.file(clientPayloadPath).text());

	// inject client source as an attribute
	serverProjectJson.tree.$properties = {
		Attributes: {
			[ATTRIBUTE]: {
				String: fullClientSource,
			},
		},
	};
}

const injectedServerProjectJsonPath = join(BUILD_DIRECTORY, "server.project.json");
// write the modified project.json
await Bun.write(Bun.file(injectedServerProjectJsonPath), JSON.stringify(serverProjectJson, undefined, 2));
// then build the final payload
await build(join(BUILD_DIRECTORY, "server.rbxm"), injectedServerProjectJsonPath, join(BUILD_DIRECTORY, "run.luau"));

console.log(`Wrote result to ${BUILD_DIRECTORY}/run.luau`);
