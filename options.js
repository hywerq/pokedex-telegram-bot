import {CONTACT_URL} from "./config.js";

export const startOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '\u{1F50D} Find data', callback_data: 'find'}],///
            [{ text: '\u{1F3AE} Play a game', callback_data: 'game'}],///
            [{ text: '\u{1F4DD} Start test', callback_data: 'test'}],///
            [
                { text: '\u{1F524} Text commands', callback_data: 'text_commands'},
                { text: '\u{1F4AC} Voice commands', callback_data: 'voice_commands'}
            ],
            [{ text: '\u{260E} Contact me', url: CONTACT_URL}]
        ]
    })
}

export const findOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '\u{1F63A} Find pokemon info', callback_data: 'pokemon_info'}],///
            [{ text: '\u{1F347} Find berry info', callback_data: 'berry_info'}],///
            [{ text: '\u{1F9F3} Find item info', callback_data: 'item_info'}],///
        ]
    })
}

export const pokemonOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '\u{1F50D} Find pokemon', callback_data: 'pokemon'}],///
            [{ text: '\u{1F4C3} Pokemon type info', callback_data: 'type'}],///
            [{ text: '\u{1F4C3} Pokemon nature info', callback_data: 'nature'}],///
            [{ text: '\u{1F50D} All pokemons by type', callback_data: 'all_type'}], ///
            [{ text: '\u{1F50D} All pokemons by shape', callback_data: 'all_shape'}],///
            [{ text: '\u{1F50D} All pokemons by color', callback_data: 'all_color'}],///
            [{ text: '\u{1F5FA} Pokemons according to their habitat', callback_data: 'habitat'}],///
        ]
    })
}

export const berryOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '\u{1F347} Find berry', callback_data: 'berry'}],///
            [{ text: `\u{1F347} Berry's firmness`, callback_data: 'firmness'}],///
            [{ text: `\u{1F347} Berry's flavor`, callback_data: 'flavor'}]///
        ]
    })
}

export const itemOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '\u{1F9F3} Find item', callback_data: 'item'}],///
            [{ text: `\u{1F9F3} All items by attribute`, callback_data: 'attribute'}]///
        ]
    })
}

export const testAnswerOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            ["A \u{2934}"],///
            ["B \u{2934}"],///
            ["C \u{2934}"],///
            ["D \u{2934}"]///
        ]
    })
}