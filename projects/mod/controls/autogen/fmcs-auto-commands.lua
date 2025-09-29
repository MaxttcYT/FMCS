commands.add_command("hello", "Says hello", function(command)
    game.player.print(
        "Hello, " .. (command.player_index and game.players[command.player_index].name or "Console") .. "!"
    )
end)