# roblox-ts-test

roblox-ts template for script builders

## Workflow

If your shell supports & parallelization:

```bash
bun run watchAzalea & bun run watch & bun run serve
```

If not, run `bun run watch` and then `bun run watchAzalea` in seperate terminals.

You should see a file in `build/run.luau` after running these commands. You can run this file in Lua Sandbox, Lua Assembling, or any compliant OpenSB implementation. Azalea's novel module method is used, so you should be able to run it anywhere.

There is an OPTIONAL http server available by running `bun run serve.ts`. It depends on [devtunnel](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started?tabs=windows), and you should run `devtunnel create` if it errors.

A more traditional, non-incremental build is still available with:

```bash
bun run build
```

### Client execution

Client support is included in this template. If you do not want it, you can delete `src/client` and `src/utils.ts`.
