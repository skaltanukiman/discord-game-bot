import { pingCommand } from "../commands/ping.js";
import { recommendCommand } from "../commands/recommend.js";

export const commands = new Map();

commands.set(pingCommand.data.name, pingCommand);
commands.set(recommendCommand.data.name, recommendCommand);