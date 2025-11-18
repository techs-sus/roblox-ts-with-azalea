import exampleValue from "./exampleModule";

for (let i = 0; i < 32; i++) {
	print("Hello from model!", exampleValue * i);
}

/* you should always cleanup or you leak instances */
script.Destroy();

export {};
