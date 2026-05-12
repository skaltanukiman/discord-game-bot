import { APIEmbedField, EmbedBuilder } from "discord.js";

/**
 * Embedフィールドが存在する場合のみEmbedへ追加する
 * 
 * embedFields が undefined または空の場合は何も行わない。
 * 条件分岐を毎回書かずに、安全に addFields を呼び出すための補助関数。
 * 
 * @param embed 対象のEmbedBuilder
 * @param embedFields 追加するEmbedフィールド配列
 */
export function addFieldsIfExists(embed: EmbedBuilder, embedFields?: APIEmbedField[]) {

    if (embedFields) {
        embed.addFields(embedFields);
    }
}