type steamAppDetailsResponse = {
    [appid: string]: {
        success: boolean;
        data: {
            name: string;
            steam_appid: number;
            genres?: {
                id: string;
                description: string;
            }[];
            categories?: {
                id: number;
                description: string;
            }[];
        };
    };
};