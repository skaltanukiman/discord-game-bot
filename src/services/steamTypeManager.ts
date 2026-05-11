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
        };
    };
};

export type MostPlayedGame = {
    rank: number;
    appid: number;
    last_week_rank: number;
    peak_in_game: number;
};

export type ExtendedSteamGameDetail = {
    steamDetail: SteamAppDetailsResponse[string]["data"];
    mostplayed: MostPlayedGame;
}