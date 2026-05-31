import { vi } from "vitest";

vi.stubEnv("DISCORD_TOKEN", "dummy-token");
vi.stubEnv("CHANNEL_ID", "dummy-channel-id");
vi.stubEnv("STEAM_API_KEY", "dummy-steam-api-key");
vi.stubEnv("OPENAI_API_KEY", "dummy-openai-key");
vi.stubEnv("CLIENT_ID", "dummy-client-id");
vi.stubEnv("GUILD_ID", "dummy-guild-id");

