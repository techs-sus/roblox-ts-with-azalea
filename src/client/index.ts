/**
 Running code on the client is possible, but please note:
 - script = ModuleScript and the hierarchy looks like this: nil -> Model [name = "DataModel"] -> ModuleScript
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

print("Client is parented to", script.Parent); // DataModel (azalea)
print("Client's parent is parented to", script.Parent?.Parent); // nil
print("Client is running under a", script.ClassName); // ModuleScript
print("clientArguments.time is", clientArguments.time);
