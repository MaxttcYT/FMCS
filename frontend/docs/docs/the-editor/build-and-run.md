---
sidebar_position: 6
---

# Building the mod

Building and testing the mod

## Building

To build your project click on `File > Build`,
this will:
    - Build all items, technologies, recipes etc. to LUA
    - Package the project to `[FMCS-ROOT]/.mod-preview/dev-mod` (All files included!)

This standalone build is mostly useful for inspecting the generated LUA.

## Building & Testing

To build and start your project click on `File > Build and Run`
or the big green button in top bar,

this will:
    - Do all what [Building](#building) does
    - Create a `mod-list.json` in `[FMCS-ROOT]/.mod-preview/dev-mod`
    - Start Factorio with mod path set to `[FMCS-ROOT]/.mod-preview/dev-mod`

This build and run method is mostly useful for testing your mod ingame.

### Whats next?

Play around a little and feel free to add custom code to the files described in
`data.lua` and `control.lua`
