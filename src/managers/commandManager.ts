import { pingCommand } from "../commands/ping.js";
import { recommendCommand } from "../commands/recommend.js";
import { gameSearchCommand } from "../commands/search.js";

export const commands = new Map();

commands.set(pingCommand.data.name, pingCommand);
commands.set(recommendCommand.data.name, recommendCommand);
commands.set(gameSearchCommand.data.name, gameSearchCommand);