import { pingCommand } from "../commands/ping.js";

export const commands = new Map();

commands.set("ping", pingCommand);