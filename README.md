# roblox-ts-test

roblox-ts template for script builders

## Workflow

If your shell supports & parallelization:

```bash
bun run watchAzalea & bun run watch
```

If not, run `bun run watch` and then `bun run watchAzalea` in seperate terminals.

You should see a `model.luau` after running these commands. You can run this file in Lua Sandbox, Lua Assembling, or any compliant OpenSB implementation. As long as the environment supports `loadstring`, `setfenv`, `getfenv` and Roblox's globals, it should work.

There is an OPTIONAL http server available by running `bun run serve.ts`. It depends on [devtunnel](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started?tabs=windows), and you should run `devtunnel create` if it errors.
