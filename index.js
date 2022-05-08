import TelegramApi from 'node-telegram-bot-api';
import Pokedex from 'pokedex-promise-v2';
import mongoose from 'mongoose';
import axios from 'axios';
import {startOptions, findOptions, testAnswerOptions, pokemonOptions, berryOptions, itemOptions} from './options.js'
import pokeController from './pokeController.js';
import {TOKEN, YA_KEY, MONGOOSE} from './config.js';
import controller from './mongooseController.js';

const P = new Pokedex();
const bot = new TelegramApi(TOKEN, {polling: true});

const chat = {};

const start = () => {
    mongoose.connect(MONGOOSE).catch(err => console.log(err))

    bot.setMyCommands([
        {command: '/start', description: 'Greet the user'},
        {command: '/text_commands', description: 'Show all text commands with description'},
        {command: '/voice_commands', description: 'Show all voice commands with description'},
        {command: '/game', description: 'Start the guessing game'},
        {command: '/test', description: 'Start pokemon matching test'},
        {command: '/stop', description: 'Stop current game'},
        {command: '/find_pokemon', description: 'Find pokemon by its name'},
        {command: '/find_type', description: `Find info of pokemon's type by its name`},
        {command: '/find_nature', description: `Find info of pokemon's nature by its name`},
        {command: '/habitat', description: `Find all pokemons according to habitat`},
        {command: '/all_pokemon_type', description: 'Get all pokemons according to their type'},
        {command: '/all_pokemon_shape', description: 'Get all pokemons according to their shape'},
        {command: '/all_pokemon_color', description: 'Get all pokemons according to their color'},
        {command: '/find_berry', description: 'Find berry info by its name'},
        {command: '/all_berry_firmness', description: 'Get all berries according to firmness'},
        {command: '/all_berry_flavor', description: 'Get all berries according to flavor'},
        {command: '/find_item', description: 'Find item info by its name'},
        {command: '/all_item_attribute', description: 'Get all items according to attribute'}
    ]);

    bot.on('voice', msg => {
        const chatId = msg.chat.id;
        const stream = bot.getFileStream(msg.voice.file_id)

        let chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', async () => {
            const axiosConfig = {
                method: 'POST',
                url: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?lang=ru-RU',
                headers: {
                    Authorization: 'Api-Key ' + YA_KEY
                },
                data: Buffer.concat(chunks)
            };

            axios(axiosConfig)
                .then((response) => {
                    const command = response.data.result;
                    switch (command) {
                        case 'Старт':
                            greetUser(chatId);
                            break;
                        case 'Выбрать категорию':
                            bot.sendMessage(chatId, 'Choose category', findOptions);
                            break;
                        case 'Покемоны':
                            bot.sendMessage(chatId, 'Pokemon info', pokemonOptions);
                            break;
                        case 'Ягоды':
                            bot.sendMessage(chatId, 'Berry info', berryOptions);
                            break;
                        case 'Предметы':
                            bot.sendMessage(chatId, 'Item info', itemOptions);
                            break;
                        case 'Текстовые команды':
                            showTextCommands(chatId);
                            break;
                        case 'Голосовые команды':
                            showVoiceCommands(chatId);
                            break;
                        case 'Начать игру':
                            startGame(chatId);
                            break;
                        case 'Начать тест':
                            startTest(chatId);
                            break;
                        case 'Стоп':
                            chat[chatId] = {};
                            bot.sendMessage(chatId, '\u{23F9} Stopped. Next step?', startOptions);
                            break;
                        case 'Найти покемона':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the name of the pokemon you are looking for\n\n' +
                                'e.g. pikachu, snorlax, lopunny');
                            chat[chatId] = {find_pokemon: true};
                            break;
                        case 'Найти тип покемона':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the type you are looking for\n\n' +
                                'e.g. normal, steel, grass');
                            chat[chatId] = {find_type: true};
                            break;
                        case 'Найти характер покемона':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the nature you are looking for\n\n' +
                                'e.g. bold, calm, jolly');
                            chat[chatId] = {find_nature: true};
                            break;
                        case 'Найти покемона по месту обитания':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the habitat name\n\n' +
                                'e.g. ground, urban, jungle');
                            chat[chatId] = {habitat: true};
                            break;
                        case 'Найти всех покемонов по типу':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the pokemons type name\n\n' +
                                'e.g. normal, steel, grass');
                            chat[chatId] = {find_all_type: true};
                            break;
                        case 'Найти всех покемонов по форме':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the shape name\n\n' +
                                'e.g. heart, ball, triangle');
                            chat[chatId] = {find_all_shape: true};
                            break;
                        case 'Найти всех покемонов по цвету':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the color name\n\n' +
                                'e.g. black, blue, white');
                            chat[chatId] = {find_all_color: true};
                            break;
                        case 'Найти ягоду':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the berry name\n\n' +
                                'e.g. leppa, tomato, mago');
                            chat[chatId] = {berry: true};
                            break;
                        case 'Найти все ягоды по твердости':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the firmness\n\n' +
                                'e.g. hard, soft, very-soft');
                            chat[chatId] = {firmness: true};
                            break;
                        case 'Найти все ягоды по вкусу':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the flavor\n\n' +
                                'e.g. sweet, sour, bitter');
                            chat[chatId] = {flavor: true};
                            break;
                        case 'Найти предмет':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the item\'s name\n\n' +
                                'e.g. poke-ball, ice-heal, potion');
                            chat[chatId] = {item: true};
                            break;
                        case 'Найти все предметы по атрибуту':
                            bot.sendMessage(chatId, '\u{1F4DD} Give me the item\'s attribute\n\n' +
                                'e.g. holdable, underground, consumable');
                            chat[chatId] = {attribute: true};
                            break;
                        default:
                            bot.sendMessage(chatId, '\u{1F641} Couldn\'t recognize your command.\n' +
                                'Could you repeat, please?')
                    }
                })
                .catch((error) => {
                    console.log(error);
                    bot.sendMessage(chatId, '\u{1F641} Couldn\'t recognize your speech')
                });
        });
    });

    bot.on('message', async msg => {
        if(msg.voice) {
            return;
        }

        const chatId = msg.chat.id;
        const args = msg.text.toLowerCase().split(' ');

        if (args[0][0] === '/') {
            if (args[0] === '/start') {
                await greetUser(chatId, msg.chat.first_name);
                return;
            }
            if (args[0] === '/text_commands') {
                await showTextCommands(chatId);
                return;
            }
            if (args[0] === '/voice_commands') {
                await showVoiceCommands(chatId);
                return;
            }
            if (args[0] === '/find_pokemon') {
                await getPokemonSpeciesByName(chatId, args[1]);
                return;
            }
            if (args[0] === '/find_nature') {
                await getNatureByName(chatId, args[1]);
                return;
            }
            if (args[0] === '/find_type') {
                await getTypeByName(chatId, args[1]);
                return;
            }
            if (args[0] === '/habitat') {
                await getHabitatPokemons(chatId, args[1]);
                return;
            }
            if (args[0] === '/all_pokemon_shape') {
                await getAllShapePokemonsByName(chatId, args[1]);
                return;
            }
            if (args[0] === '/all_pokemon_type') {
                await getAllTypePokemonsByName(chatId, args[1]);
                return;
            }
            if (args[0] === '/all_pokemon_color') {
                await getAllColorPokemonsByName(chatId, args[1]);
                return;
            }
            if (args[0] === '/find_berry') {
                await getBerryByName(chatId, args[1]);
                return;
            }
            if (args[0] === '/all_berry_firmness') {
                await getBerriesByFirmnessName(chatId, args[1]);
                return;
            }
            if (args[0] === '/all_berry_flavor') {
                await getBerriesByFlavorName(chatId, args[1]);
                return;
            }
            if (args[0] === '/find_item') {
                await getItemByName(chatId, args[1]);
                return;
            }
            if (args[0] === '/all_item_attribute') {
                await getItemsByAttributeName(chatId, args[1]);
                return;
            }
            if (args[0] === '/game') {
                await startGame(chatId);
                return;
            }
            if (args[0] === '/test') {
                await startTest(chatId);
                return;
            }
            if (args[0] === '/stop') {
                chat[chatId] = {};
                await bot.sendMessage(chatId, '\u{23F9} Stopped. Next step?', startOptions);
                return;
            }
        }
        if (chat[chatId] !== undefined) {
            if (chat[chatId].hasOwnProperty('game')) {
                if (args[0] === chat[chatId].pokemon) {
                    chat[chatId].count++;
                    await bot.sendMessage(chatId, '\u{2728} Absolutely right! \u{2728}');

                    if (chat[chatId].count !== 1) {
                        await sendNextPokemon(chatId);
                    } else {
                        const result = (Date.now() - chat[chatId].game) / 1000;

                        await bot.sendMessage(chatId, 'Congrats!\u{1F929} You won!');
                        await bot.sendMessage(chatId, `\u{23F1} Your time is ${result} seconds!`);
                        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/11d/46f/11d46fe5-3fa2-4c4e-a912-aa8c917b468f/192/3.webp');

                        await controller.putResult({
                            user: msg.chat.username,
                            time: result
                        });
                        await controller.getRating();
                        chat[chatId] = {};
                    }
                } else {
                    await bot.sendMessage(chatId, 'Nope, not right \u{1F972}');
                }
                return;
            }
            if (chat[chatId].hasOwnProperty('test')) {
                switch (args[0]) {
                    case 'a':
                        chat[chatId].result += 1;
                        break;
                    case 'b':
                        chat[chatId].result += 2;
                        break;
                    case 'c':
                        chat[chatId].result += 3;
                        break;
                    case 'd':
                        chat[chatId].result += 4;
                        break;
                    default:
                        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/892/8b3/8928b363-c309-389c-9f2d-9114ff72f2e0/192/14.webp', testAnswerOptions);
                        return;
                }
                chat[chatId].test++;
                await sendNextQuestion(chatId);
                return;
            }
            if (chat[chatId].hasOwnProperty('find_pokemon')) {
                await getPokemonSpeciesByName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('find_type')) {
                await getTypeByName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('find_nature')) {
                await getNatureByName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('habitat')) {
                await getHabitatPokemons(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('find_all_type')) {
                await getAllTypePokemonsByName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('find_all_shape')) {
                await getAllShapePokemonsByName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('find_all_color')) {
                await getAllColorPokemonsByName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('berry')) {
                await getBerryByName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('firmness')) {
                await getBerriesByFirmnessName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('flavor')) {
                await getBerriesByFlavorName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('item')) {
                await getItemByName(chatId, args[0]);
                return;
            }
            if (chat[chatId].hasOwnProperty('attribute')) {
                await getItemsByAttributeName(chatId, args[0]);
                return;
            }
        }

        await sendPardon(chatId, msg.message_id);
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        //console.log(data)

        switch (data) {
            case 'find':
                await bot.sendMessage(chatId, 'Choose category', findOptions);
                break;
            case 'text_commands':
                await showTextCommands(chatId);
                break;
            case 'voice_commands':
                await showVoiceCommands(chatId);
                break;
            case 'pokemon_info':
                await bot.sendMessage(chatId, 'Pokemon info', pokemonOptions);
                break;
            case 'berry_info':
                await bot.sendMessage(chatId, 'Berry info', berryOptions);
                break;
            case 'item_info':
                await bot.sendMessage(chatId, 'Item info', itemOptions);
                break;
            case 'game':
                await startGame(chatId);
                break;
            case 'test':
                await startTest(chatId);
                break;
            case 'pokemon':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the name of the pokemon you are looking for\n\n' +
                    'e.g. pikachu, snorlax, lopunny');
                chat[chatId] = {find_pokemon: true};
                break;
            case 'type':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the type you are looking for\n\n' +
                    'e.g. normal, steel, grass');
                chat[chatId] = {find_type: true};
                break;
            case 'nature':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the nature you are looking for\n\n' +
                    'e.g. bold, calm, jolly');
                chat[chatId] = {find_nature: true};
                break;
            case 'habitat':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the habitat name\n\n' +
                    'e.g. ground, urban, jungle');
                chat[chatId] = {habitat: true};
                break;
            case 'all_type':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the pokemons type name\n\n' +
                    'e.g. normal, steel, grass');
                chat[chatId] = {find_all_type: true};
                break;
            case 'all_shape':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the shape name\n\n' +
                    'e.g. heart, ball, triangle');
                chat[chatId] = {find_all_shape: true};
                break;
            case 'all_color':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the color name\n\n' +
                    'e.g. black, blue, white');
                chat[chatId] = {find_all_color: true};
                break;
            case 'berry':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the berry name\n\n' +
                    'e.g. leppa, tomato, mago');
                chat[chatId] = {berry: true};
                break;
            case 'firmness':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the firmness\n\n' +
                    'e.g. hard, soft, very-soft');
                chat[chatId] = {firmness: true};
                break;
            case 'flavor':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the flavor\n\n' +
                    'e.g. sweet, sour, bitter');
                chat[chatId] = {flavor: true};
                break;
            case 'item':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the item\'s name\n\n' +
                    'e.g. poke-ball, ice-heal, potion');
                chat[chatId] = {item: true};
                break;
            case 'attribute':
                await bot.sendMessage(chatId, '\u{1F4DD} Give me the item\'s attribute\n\n' +
                    'e.g. holdable, underground, consumable');
                chat[chatId] = {attribute: true};
                break;
        }
    });

    bot.on('polling_error', console.log);
}

async function greetUser(chatId, name) {
    await bot.sendMessage(chatId, `Nice to see you, ${name}!`);
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/11d/46f/11d46fe5-3fa2-4c4e-a912-aa8c917b468f/5.webp');
    await bot.sendMessage(chatId, 'What would you like to do?', startOptions);
}

async function sendPardon(chatId, id) {
    await bot.sendMessage(chatId, 'Pardon?', {reply_to_message_id: id});
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5d8/80e/5d880e68-11fe-47e3-bb16-39da41e6ffd9/192/16.webp');
}

async function showTextCommands(chatId) {
    const message =
        '/start - Greet the user\n' +
        '/text_commands - Show all text commands with description\n' +
        '/voice_commands - Show all voice commands with description\n' +
        '/game - Start the guessing game\n' +
        '/test - Start pokemon matching test\n' +
        '/stop - Stop current process\n' +
        '/find_pokemon [name] - Find pokemon by its name\n' +
        '/find_type [type] - Find info of pokemon\'s type by its name\n' +
        '/find_nature [nature] - Find info of pokemon\'s nature by its name\n' +
        '/habitat [habitat] - Find all pokemons according to habitat\n' +
        '/all_pokemon_type [type] - Get all pokemons according to their type\n' +
        '/all_pokemon_shape [shape] - Get all pokemons according to their shape\n' +
        '/all_pokemon_color [color] - Get all pokemons according to their color\n' +
        '/find_berry [berry] - Find berry info by its name\n' +
        '/all_berry_firmness [firmness] - Get all berries according to firmness\n' +
        '/all_berry_flavor [flavor] - Get all berries according to flavor\n' +
        '/find_item [item] - Find item info by its name\n' +
        '/all_item_attribute [attribute] - Get all items according to attribute';
    await bot.sendMessage(chatId, message);}

async function showVoiceCommands(chatId) {
    const message =
        '\u{1F4AC} «Старт» - Greet the user\n' +
        '\u{1F4AC} «Текстовые команды» - Show all text commands with description\n' +
        '\u{1F4AC} «Голосовые команды» - Show all voice commands with description\n' +
        '\u{1F4AC} «Начать игру» - Start the guessing game\n' +
        '\u{1F4AC} «Начать тест» - Start pokemon matching test\n' +
        '\u{1F4AC} «Стоп»- Stop current process\n' +
        '\u{1F4AC} «Выбрать категорию» - Select a category to search\n' +
        '\u{1F4AC} «Покемоны» - Search in pokemon category\n' +
        '\u{1F4AC} «Ягоды» - Search in berry category\n' +
        '\u{1F4AC} «Предметы» - Search item category\n' +
        '\u{1F4AC} «Найти покемона» - Find pokemon by its name\n' +
        '\u{1F4AC} «Найти тип покемона» - Find info of pokemon\'s type by its name\n' +
        '\u{1F4AC} «Найти характер покемона» - Find info of pokemon\'s nature by its name\n' +
        '\u{1F4AC} «Найти покемона по месту обитания» - Find all pokemons according to habitat\n' +
        '\u{1F4AC} «Найти всех покемонов по типу» - Get all pokemons according to their type\n' +
        '\u{1F4AC} «Найти всех покемонов по форме» - Get all pokemons according to their shape\n' +
        '\u{1F4AC} «Найти всех покемонов по цвету» - Get all pokemons according to their color\n' +
        '\u{1F4AC} «Найти ягоду» - Find berry info by its name\n' +
        '\u{1F4AC} «Найти все ягоды по твердости» - Get all berries according to firmness\n' +
        '\u{1F4AC} «Найти все ягоды по вкусу» - Get all berries according to flavor\n' +
        '\u{1F4AC} «Найти предмет» - Find item info by its name\n' +
        '\u{1F4AC} «Найти все предметы по атрибуту» - Get all items according to attribute';
    await bot.sendMessage(chatId, message);}

/* Game */
async function startGame(chatId) {
    await bot.sendMessage(chatId, 'In this game you have to guess 10 ' +
        'random pokemons with no time limits.\nTimer has been started! ' +
        'Good luck ><');
    chat[chatId] = {game: Date.now(), pokemon: '', count: 0};
    await sendNextPokemon(chatId);
}

async function sendNextPokemon(chatId) {
    const random = Math.floor(Math.random() * 1000);
    await P.getPokemonSpeciesByName(random, (response, error) => {
        if (!error) {
            chat[chatId].pokemon = response.names
                .filter(pokeAPIName => pokeAPIName.language.name === 'en')[0].name.toLowerCase();
            bot.sendMessage(chatId, `Pokemon №${chat[chatId].count + 1}`);
            bot.sendMessage(chatId, `${chat[chatId].pokemon}`);
            bot.sendPhoto(chatId, `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${random}.png`);
        } else {
            bot.sendMessage(chatId, `Couldn't get next pokemon. Finding a new one \u{2639}`);
            sendNextPokemon(chatId)
        }
    })
}

/* Test */
async function startTest(chatId) {
    await bot.sendMessage(chatId, 'You can take this quiz to ' +
        'find out which Pokémon type from the game matches your ' +
        'answers most closely!');

    chat[chatId] = {test: 1, result: 0};
    await sendNextQuestion(chatId);
}

async function sendNextQuestion(chatId) {
    switch (chat[chatId].test) {
        case 1:
            await bot.sendMessage(chatId, '\u{2753} What pattern would you spread ' +
                'all over your life? Pick the one you like best!\n\n', testAnswerOptions);

            await bot.sendMessage(chatId, 'A: Polka dots');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/polkadots-639303620-421x421.jpg.webp');

            await bot.sendMessage(chatId, 'B: Plaid');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/plaid-589949200-421x421.jpg.webp');

            await bot.sendMessage(chatId, 'C: Strips');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/stripes-841738758-421x421.jpg.webp');

            await bot.sendMessage(chatId, `D: Floral`);
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/floral-618200670-421x421.jpg.webp');
            break;
        case 2:
            await bot.sendMessage(chatId, '\u{2753} Pallet Town sees the same ' +
                'constellations as we do. Which sign were you born under?\n\n' +
                'A: Aries, Taurus, Gemini\n' +
                'B: Cancer, Leo, Virgo\n' +
                'C: Libra, Scorpio, Sagittarius\n' +
                'D: Capricorn, Aquarius, Pisces',
                testAnswerOptions);
            break;
        case 3:
            await bot.sendMessage(chatId, '\u{2753} Taking over the world is ' +
                'serious business! What special skill are you going to use ' +
                'to make it all yours?\n\n' +
                'A: Gardening\n' +
                'B: Access to endless money\n' +
                'C: Martial arts\n' +
                'D: Healing myself and others',
                testAnswerOptions);
            break;
        case 4:
            await bot.sendMessage(chatId, '\u{2753} What’s more diverse than types ' +
                'of Pokémon is types of people in the world. How do you fit in?\n\n' +
                'A: It’s easy for me to make new friends! ' +
                'I’m versatile and get along with most.\n' +
                'B: I’m comfortable in certain cliques, but choose wisely.\n' +
                'C: I’m a bit different. My relationships are truly special.\n' +
                'D: I’m just a cool dude.',
                testAnswerOptions);
            break;
        case 5:
            await bot.sendMessage(chatId, '\u{2753} Badges are more than just tokens ' +
                'of accomplishment — they’re badges of honor. ' +
                'Which one do you like the best?\n\n', testAnswerOptions);

            await bot.sendMessage(chatId, 'A: Soul');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/Poke%CC%81mon-04e-421x421.jpg.webp');

            await bot.sendMessage(chatId, 'B: Marsh');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/Poke%CC%81mon-04f-421x421.jpg.webp');

            await bot.sendMessage(chatId, 'C: Volcano');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/Poke%CC%81mon-04g-421x421.jpg.webp');

            await bot.sendMessage(chatId, 'D: Earth');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/Poke%CC%81mon-04h-421x421.jpg.webp');
            break;
        case 6:
            await bot.sendMessage(chatId, '\u{2753} Your personality can change with ' +
                'time and experience. Where are you in your personal evolution?\n\n' +
                'A: Have lots of growing to do.\n' +
                'B: Constantly changing. My old friends barely recognize me.\n' +
                'C: Always been my true self.\n' +
                'D: I think this question is too complicated.',
                testAnswerOptions);
            break;
        case 7:
            await bot.sendMessage(chatId, '\u{2753} The secret to a happy and successful life is…?\n\n' +
                'A: Hard work and determination.\n' +
                'B: Spreading love and being happy.\n' +
                'C: Using my powers to be as useful as possible.\n' +
                'D: Living in the moment..',
                testAnswerOptions);
            break;
        case 8:
            await bot.sendMessage(chatId, `\u{2753} You've reached level 5!` +
                `Which team do you choose?\n\n`,testAnswerOptions);

            await bot.sendMessage(chatId, 'A: Team Valor');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/Poke%CC%81mon-09a-421x421.jpg.webp');

            await bot.sendMessage(chatId, 'B: Team Mystic');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/Poke%CC%81mon-09b-421x421.jpg.webp');

            await bot.sendMessage(chatId, 'C: Team Instinct');
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/Poke%CC%81mon-09c-421x421.png.webp');

            await bot.sendMessage(chatId, `D: I'm not playing`);
            await bot.sendSticker(chatId, 'https://www.magiquiz.com/wp-content/uploads/2016/07/Poke%CC%81mon-09d-421x421.jpg.webp');
            break;
        case 9:
            await bot.sendMessage(chatId, 'Oh... \u{1F914} I see that...');
            await bot.sendMessage(chatId, 'The best pokemon for you...');
            await bot.sendMessage(chatId, 'Is...');

            switch (Math.floor(chat[chatId].result / 4)) {
                case 1:
                    await getPokemonSpeciesByName(chatId, 101);
                    break;
                case 2:
                    await getPokemonSpeciesByName(chatId, 102);
                    break;
                case 3:
                    await getPokemonSpeciesByName(chatId, 103);
                    break;
                case 4:
                    await getPokemonSpeciesByName(chatId, 104);
                    break;
                case 5:
                    await getPokemonSpeciesByName(chatId, 105);
                    break;
                case 6:
                    await getPokemonSpeciesByName(chatId, 106);
                    break;
                case 7:
                    await getPokemonSpeciesByName(chatId, 107);
                    break;
                case 8:
                    await getPokemonSpeciesByName(chatId, 108);
                    break;
            }
            chat[chatId] = {};

            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/11d/46f/11d46fe5-3fa2-4c4e-a912-aa8c917b468f/3.webp');
            break;
    }
}

/* Pokemon info */
async function getPokemonSpeciesByName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the name');
        return;
    }

    await P.getPokemonSpeciesByName(name, (response, error) => {
        if (!error) {
            bot.sendMessage(chatId, pokeController.getPokemonDataMessage(response));
            bot.sendPhoto(chatId, `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${response.id}.png`);
        } else {
            console.log(error)
            bot.sendMessage(chatId, `Couldn't get ${name}`);
        }
    })
    chat[chatId] = {};
}

async function getNatureByName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the nature name');
        return;
    }

    P.getNatureByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getNatureDataMessage(response));
        })
        .catch((error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`);
        });
    chat[chatId] = {};
}

async function getTypeByName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the type name');
        return;
    }

    P.getTypeByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getTypeDataMessage(response));
        })
        .catch((error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`);
        });
    chat[chatId] = {};
}

async function getAllTypePokemonsByName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the type name');
        return;
    }

    P.getTypeByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getAllTypePokemonsMessage(response));
        })
        .catch((error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`);
        });
    chat[chatId] = {};
}

async function getAllShapePokemonsByName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the shape');
        return;
    }

    P.getPokemonShapeByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getAllPokemonsMessage(response));
        })
        .catch((error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`);
        });
    chat[chatId] = {};
}

async function getAllColorPokemonsByName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the color');
        return;
    }

    P.getPokemonColorByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getAllPokemonsMessage(response));
        })
        .catch((error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`);
        });
    chat[chatId] = {};
}

async function getHabitatPokemons(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the habitat');
        return;
    }

    P.getTypeByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getHabitatPokemonsMessage(response));
        })
        .catch((error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`);
        });
    chat[chatId] = {};
}

/* Berry info */
async function getBerryByName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the berry');
        return;
    }

    P.getBerryByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getBerryByNameMessage(response));
            bot.sendPhoto(chatId, `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${response.item.name}.png`)
        })
        .catch( (error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`)
        });
    chat[chatId] = {};
}

async function getBerriesByFirmnessName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the firmness');
        return;
    }

    P.getBerryFirmnessByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getBerriesByFirmnessMessage(response));
        })
        .catch( (error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`)
        });
    chat[chatId] = {};
}

async function getBerriesByFlavorName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the flavor');
        return;
    }

    P.getBerryFlavorByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getBerriesByFlavorMessage(response));
        })
        .catch( (error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`)
        });
    chat[chatId] = {};
}

/* Item info */
async function getItemByName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the item\'s name');
        return;
    }

    P.getItemByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getItemByNameMessage(response));
            bot.sendPhoto(chatId, `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${response.name}.png`)
        })
        .catch( (error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`)
        });
    chat[chatId] = {};
}

async function getItemsByAttributeName(chatId, name) {
    if (name === undefined) {
        await bot.sendMessage(chatId, 'Oops, seems like you forgot the item\'s name');
        return;
    }

    P.getItemAttributeByName(name)
        .then((response) => {
            bot.sendMessage(chatId, pokeController.getItemsByAttributeMessage(response));
            bot.sendPhoto(chatId, `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${response.item.name}.png`)
        })
        .catch( (error) => {
            console.log(error);
            bot.sendMessage(chatId, `Couldn't get ${name}`)
        });
    chat[chatId] = {};
}

start()