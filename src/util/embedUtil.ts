import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { addFieldsIfExists } from "../helper/embedHelper.js";
import { generalSetting, testSettings } from "../config/setting.js";
import { formatCategories, formatGenres } from "../formatter/steamDataFormatter.js";
import { priceInfoMapping } from "../local/localMapping.js";
import { removeHtmlTag } from "../formatter/textFormatter.js";
import { detailFieldsSelector } from "../config/sendItemSetting.js";
import { generateGameDescription } from "../services/openaiService.js";
import { requestContext } from "../context/requestContext.js";

export async function createEmbed(data: ExtendedSteamGameDetail) {
    const title = data.steamDetail.name;
    const headerImage = data.steamDetail.header_image;
    
    const embed = new EmbedBuilder().setTitle(title);

    const context = requestContext.getStore();
    if (generalSetting.api.descriptionGenerate && (context?.useOpenAI ?? true)) {
        // セッティングのAPI使用設定がtrueの場合かつコンテキストがtrue（undefindの場合も許可）

        const geDescription = await generateGameDescription(data);
        embed.setDescription(geDescription);
    }
    else {
        embed.setDescription("openapi不使用");
    }
        
    // ヘッダーイメージがある場合のみ追加する
    headerImage && embed.setImage(headerImage);

    const fields = pushFieldElements(data);
    
    addFieldsIfExists(embed, fields);

    return embed;
}

export function createButton(data: ExtendedSteamGameDetail) {
    const appid = data.mostplayed.appid;

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder().setLabel("Steamを見る").setStyle(ButtonStyle.Link).setURL(`https://store.steampowered.com/app/${appid}`));

    return buttons;
}

function pushFieldElements(data: ExtendedSteamGameDetail): APIEmbedField[] {
    const release_date = data.steamDetail.release_date;
    const player_count = data.currentPlayers?.player_count;

    const fields: APIEmbedField[] = [];

    if (detailFieldsSelector.Genres) addGenresFields(fields, data);

    if (detailFieldsSelector.Categorise) addCategoriseFields(fields, data);

    if (detailFieldsSelector.Price) addPriceFields(fields, data, [priceInfoMapping.lang.JPY]);
    
    if (detailFieldsSelector.release_date) release_date && fields.push({ name: "リリース日", value: release_date.date });
    
    if (detailFieldsSelector.currentPlayers) player_count != null && fields.push({ name: "現在プレイ人数", value: `${player_count.toLocaleString()} 人プレイ中` });

    if (detailFieldsSelector.hasJapaneseLanguage) {
        if (hasJapaneseLanguage(data) === false) fields.push({ name: "言語", value: "×日本語非対応" });
    }

    return fields;
}

function addGenresFields(fields: APIEmbedField[], data: ExtendedSteamGameDetail) {
    const genres = formatGenres(data);

    if (genres) {
        // ジャンルがundefindでないときのみ追加
        fields.push({ name: "ジャンル", value: genres });
    }
}

function addCategoriseFields(fields: APIEmbedField[], data: ExtendedSteamGameDetail) {
    const categories = formatCategories(data);

    if (categories) {
        // カテゴリーがundefindでないときのみ追加
        fields.push({ name: "カテゴリー", value: categories });
    }
}

/**
 * Steamゲームの価格情報をEmbedフィールドへ追加する
 * 
 * 通貨に対応した価格名を使用し、
 * 通常価格・割引率・セール価格をfieldsへ追加する。
 * 
 * 無料ゲームの場合は無料表記を追加する。
 * 
 * また、割引率が0かつ通常価格が存在しない場合は、
 * final_formatted を通常価格として扱う。
 * 
 * price_overview が存在しない場合は何もしない。
 * 
 * @param fields 追加対象のEmbedフィールド配列
 * @param data Steamゲーム詳細情報
 * @param exLang 対応通貨一覧
 */
function addPriceFields(fields: APIEmbedField[], data: ExtendedSteamGameDetail, exLang: string[]) {
    const price = data.steamDetail.price_overview;
    const isFree = data.steamDetail.is_free;

    if (isFree) {
        fields.push({ name: priceInfoMapping.price[exLang[0] as keyof typeof priceInfoMapping.price] ?? "Price",
                      value: priceInfoMapping.free_notation[exLang[0] as keyof typeof priceInfoMapping.free_notation] ?? "Free"
        });

        return;  // 無料フラグが立っている場合はこの時点でリターン
    }

    if (!price) return;

    if (exLang.includes(price.currency)) {
        if (price.initial_formatted) fields.push({ name: priceInfoMapping.price[price.currency as keyof typeof priceInfoMapping.price] ?? "Price",
                                                   value: price.initial_formatted
                                    });
        if (price.final_formatted) {
            if (price.discount_percent > 0) {
                fields.push({ name: priceInfoMapping.discount[price.currency as keyof typeof priceInfoMapping.discount] ?? "Discount", value: `${String(price.discount_percent)}%` });
                fields.push({ name: priceInfoMapping.discount_price[price.currency as keyof typeof priceInfoMapping.discount_price] ?? "Discount Price", value: price.final_formatted });
            }
            else {
                // 割引率0かつ元価格が存在しないときはこちらの最終金額を通常価格として表示する
                if (!price.initial_formatted) fields.push({ name: priceInfoMapping.price[price.currency as keyof typeof priceInfoMapping.price] ?? "Price", value: price.final_formatted });
            }
        }
    }
}

/**
 * Steamゲームが日本語対応しているかを判定する
 * 
 * supported_languages に含まれるHTMLタグを除去後、
 * 「日本語」が含まれているかを判定する。
 * 
 * supported_languages が存在しない場合は
 * 判定不可として null を返す。
 * 
 * @param data Steamゲーム詳細情報
 * @returns 日本語対応=true, 非対応=false, 判定不可=null
 */
function hasJapaneseLanguage(data: ExtendedSteamGameDetail): boolean | null {
    const supported_languages = data.steamDetail.supported_languages;

    if (!supported_languages) return null;

    const lang = removeHtmlTag(supported_languages);

    return lang.includes("日本語");
}