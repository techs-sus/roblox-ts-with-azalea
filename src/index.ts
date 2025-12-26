import { loadClientCode } from "utils";

declare const owner: Player;

print("hello from server!");

/* you should always cleanup or you leak instances */
script.Destroy();

loadClientCode(owner, {
	time: os.time(),
});

export {};
