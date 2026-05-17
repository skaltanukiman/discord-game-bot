import { Models } from "openai/resources";
import { formatGenres } from "../formatter/steamDataFormatter.js";
import { openai } from "../index.js";
import { PromptsType } from "./openaiTypeManager.js";
import { ExtendedSteamGameDetail } from "./steamTypeManager.js";

export async function generateGameDescription(data: ExtendedSteamGameDetail): Promise<string> {
    const prompts: PromptsType = createPrompt(data);

    const response = await openai.chat.completions.create({
        model: "gpt-5.4-mini",
        temperature: 0.9,
        messages: [
            {role: "developer", content: prompts.dvlpPrompt},
            {role: "user", content: prompts.userPrompt}
        ]
    });

    return response.choices[0]?.message.content?.trim() || "取得できませんでした";
}

function createPrompt(data: ExtendedSteamGameDetail): PromptsType {
    const title = data.steamDetail.name;
    const genres = formatGenres(data) ?? "不明";
    const gameDescription = ""

    const dvlp = `
    あなたはSteamゲーム紹介Botです。

    Discord向けにゲームを紹介してください。

    ・絵文字は使わない
    ・親しみやすく
    ・3〜5行程度で
    ・ゲームの特徴を押し出す
    ・出力の度に違う雰囲気と文章で書く
    ・ワンパターンにならないようにする
    ・毎回異なる表現を使う
    ・同じ言い回しを避ける
    ・語尾が単調にならないようにする
    ・マルチプレイ要素がある場合は、協力・対戦内容を自然に説明する
    ・存在しない要素を作らない
    ・説明文をそのまま繰り返さない
    `.trim();

    const userPrompt = `
    ゲームタイトル: ${title}

    ジャンル:
    ${genres}

    説明:
    ${gameDescription}
    
    `.trim();

    const prompts: PromptsType = {
        dvlpPrompt: dvlp,
        userPrompt: userPrompt
    }

    return prompts;
}