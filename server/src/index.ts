import { loadClientCode } from "./utils";
import { makeHello } from "@rbxts/shared";

declare const owner: Player;
loadClientCode(owner, undefined);

print(makeHello("server"));

export {};
