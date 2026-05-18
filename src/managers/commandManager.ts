import { pingCommand } from "../commands/ping.js";
import { recommendCommand } from "../commands/recommend.js";

export const commands = new Map();

commands.set("ping", pingCommand);
commands.set("recommend", recommendCommand);