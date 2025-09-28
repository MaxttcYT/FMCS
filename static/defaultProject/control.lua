
-- Example of handling events in control.lua
script.on_event(defines.events.on_player_created, function(event)
  local player = game.players[event.player_index]
  player.print("Welcome to your new mod!")
end)

--Example: add command to say hello
commands.add_command("hello", "Says hello", function(command)
  game.player.print("Hello, " .. (command.player_index and game.players[command.player_index].name or "Console") .. "!")
end)
