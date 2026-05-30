export type SteamAppDetailsResponse = {
    [appid: string]: {
        success: boolean;
        data: {
            type: string;
            name: string;
            steam_appid: number;
            is_free: boolean;
            supported_languages?: string;
            website?: string;
            header_image?: string;
            genres?: {
                id: string;
                description: string;
            }[];
            categories?: {
                id: number;
                description: string;
            }[];
            recommendations?: {
                total: number;
            };
            release_date?: {
                coming_soon: boolean;
                date: string;
            };
            price_overview?: {
                currency: string;
                initial: number;
                final: number;
                discount_percent: number;
                initial_formatted?: string;
                final_formatted?: string;
            };
        };
    };
};

export type MostPlayedGame = {
    rank: number;
    appid: number;
    last_week_rank: number;
    peak_in_game: number;
};

export type CurrentPlayersResponse = {
    response: {
        result: number;
        player_count?: number;
    };
};

export type CurrentPlayersData = {
    [appid: string]: {
        data: {
            player_count: number;
        };
    };
};

export type ExtendedSteamGameDetail = {
    steamDetail: SteamAppDetailsResponse[string]["data"];
    mostplayed: MostPlayedGame;
    currentPlayers?: CurrentPlayersData[string]["data"];
};

export type SteamStoreApp = {
    appid: number;
    name: string;
    last_modified?: number;
    price_change_number?: number;
};

export type IStoreServiceGetAppListResponse = {
    response: {
        apps?: SteamStoreApp[];
        have_more_results?: boolean;
        last_appid?: number;
    };
};