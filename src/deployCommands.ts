import "dotenv/config";
import { env } from "./config/env.js";
import { REST, Routes } from "discord.js";
import { pingCommand } from "./commands/ping.js";

const commands = [pingCommand.data.toJSON()];

const rest = new REST({ version: "10" }).setToken(env.discordToken);

async function deploy() {

    await rest.put(
        Routes.applicationGuildCommands(env.clientId, env.guildId),
        {body: commands}
    );

    console.log("コマンド登録が完了しました");
}

deploy();