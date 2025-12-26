/**
 Running code on the client is possible, but please note:
 - script = ModuleScript and script.Parent = nil
 - Functions from your environment that create scripts will not work (NewScript, NewLocalScript, NewModuleScript)
 - Network serializable arguments can be passed in the form of an environment variable.
**/

/* glue start */
if (!game.GetService("RunService").IsClient()) error("Client code should not be required from the server!");
export = undefined; /* index ModuleScript's should never export anything */
/* glue end */

// note that no validation is done
declare const clientArguments: {
	time: number;
};

print("hello from client!");

print(script.Parent); // nil
print(script.ClassName); // ModuleScript
print("got time from server:", clientArguments.time);
