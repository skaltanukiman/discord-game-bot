type DetailFieldsSelectorType = {
    Genres: boolean;
    Categorise: boolean;
    Price: boolean;
    release_date: boolean;
    currentPlayers: boolean;
    hasJapaneseLanguage: boolean;
}

export const detailFieldsSelector: DetailFieldsSelectorType = {
    Genres: true,
    Categorise: false,
    Price: true,
    release_date: true,
    currentPlayers: true,
    hasJapaneseLanguage: true
}