{
  description = "a flake which contains a devshell, package, and formatter";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    azalea.url = "github:techs-sus/azalea";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      azalea,
      ...
    }@inputs:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            turbo

            rojo
            azalea.packages.${system}.default
          ];

          shellHook = "";
        };

        formatter = pkgs.nixfmt-tree;
        packages.default = pkgs.callPackage ./. {
          inherit inputs;
          inherit pkgs;
        };
      }
    );
}
