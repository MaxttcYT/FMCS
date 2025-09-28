-- Contains runtime scripting (event-driven logic),
-- like on_tick, on_built_entity, etc. It only runs in-game,
-- not during mod loading.

-- Example of handling events in control.lua
script.on_event(defines.events.on_player_joined_game, function(event)
    game.print("Welcome to FMCS´s Template Mod! Enjoy the game.")
end)


--Example: add command to say hello
commands.add_command("hello", "Says hello", function(command)
  game.player.print("Hello, " .. (command.player_index and game.players[command.player_index].name or "Console") .. "!")
end)