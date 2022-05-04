function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
}

export class PokemonAPI {
    getPokemonDataMessage (response) {
        console.log(response)
        const name = response.names.filter(pokeAPIName => pokeAPIName.language.name === 'en')[0].name;
        const rate = response.is_legendary
            ? 'Legendary pokemon'
            : response.is_mythical
                ? 'Epic pokemon'
                : 'Ordinary pokemon';
        const description = response.flavor_text_entries.filter(pokeAPIName => pokeAPIName.language.name === 'en')[11].flavor_text;
        const color = 'Color: ' + response.color.name;

        let  eggGroup = 'Egg group: ';
        if (!Array.isArray(response.egg_groups)) {
            eggGroup += response.egg_groups[0].name;
        }
        else {
            response.egg_groups.forEach(element => {
                eggGroup+= element.name + ', ';
            });
        }

        const baseHappiness = 'Base happiness: ' + response.base_happiness;
        const captureRate = 'Capture rate: ' + response.capture_rate;

        let habitat = 'Habitat: ';
        if(response.habitat !== null) {
            if (!Array.isArray(response.habitat)) {
                habitat += response.habitat.name;
            } else {
                response.habitat.forEach(element => {
                    habitat += element.name + ', ';
                });
            }
        }
        else {
            habitat += '-';
        }

        const forms = response.forms_switchable
            ? 'Can switch forms'
            : `Doesn't switch forms`
        const genderDiff = response.has_gender_differences
            ? 'Has gender differences'
            : `Doesn't have gender differences`;

        const message =
            name + '\n'
            + rate + '\n\n'
            + description + '\n\n'
            + color + '\n'
            + eggGroup + '\n'
            + habitat + '\n'
            + baseHappiness + '\n'
            + captureRate + '\n'
            + forms + '\n'
            + genderDiff;

        return message;
    }
    getNatureDataMessage (response) {
        const increasedStat = 'Increased stat: ' + response.increased_stat.name;
        const decreasedStat = 'Decreased stat: ' + response.decreased_stat.name;
        const likesFlavor = 'Likes flavor: ' + response.likes_flavor.name;
        const hatesFlavor = 'Hates flavor: ' + response.hates_flavor.name;

        const message =
            increasedStat + '\n'
            + decreasedStat + '\n'
            + likesFlavor + '\n'
            + hatesFlavor;

        return message;
    }
    getTypeDataMessage (response) {
        const damageType = 'Damage type: ' + response.move_damage_class.name;
        let moves = 'Moves: \n';

        const iterator = response.moves.values();
        for (let elements of iterator) {
            moves += elements.name + '\n';
        }

        return  damageType + '\n' + moves;
    }
    getAllTypePokemonsMessage (response) {
        let pokemons = '';

        const array = response.pokemon.sort(function(a,b) {
            return a.pokemon.name > b.pokemon.name ? 1 : b.pokemon.name > a.pokemon.name ? -1 : 0;
            });

        array.forEach(element => {
            pokemons += capitalize(element.pokemon.name) + '\n';
        })

        return pokemons;
    }
    getAllShapePokemonsMessage (response) {
        let pokemons = '';

        const array = response.pokemon_species.sort(function(a,b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });

        array.forEach(element => {
            pokemons += capitalize(element.name) + '\n';
        })

        return pokemons;
    }
    getAllColorPokemonsMessage (response) {
        let pokemons = '';

        const array = response.pokemon_species.sort(function(a,b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });

        array.forEach(element => {
            pokemons += capitalize(element.name) + '\n';
        })

        return pokemons;
    }

    getBerryByNameMessage (response) {
        const name = capitalize(response.name);
        const firmness = 'Firmness: ' + response.firmness.name;

        let array = response.flavors.sort(function(a,b) {
            return a.flavor.name > b.flavor.name ? 1 : b.flavor.name > a.flavor.name ? -1 : 0;
        });

        let flavor = 'Flavors: ';
        array.forEach(element => {
            flavor += element.flavor.name + ', ';
        })

        let power_type = 'Natural gift type: ' + response.natural_gift_type.name;

        const growth_time = 'Growth time: ' + response.growth_time;
        const max_harvest = 'Max harvest: ' + response.max_harvest;
        const power = 'Natural gift power: ' + response.natural_gift_power;
        const smoothness = 'Smoothness: ' + response.smoothness;
        const soil_dryness = 'Soil dryness: ' + response.soil_dryness;

        const message = name + '\n\n'
            + growth_time + '\n'
            + max_harvest + '\n'
            + power + '\n'
            + power_type + '\n'
            + flavor + '\n\n'
            + firmness + '\n'
            + smoothness + '\n'
            +soil_dryness + '\n';

        return message;
    }
    getBerriesByFlavorMessage(response) {
        let array = response.berries.sort(function(a,b) {
            return a.berry.name > b.berry.name ? 1 : b.berry.name > a.berry.name ? -1 : 0;
        });

        let berries = 'Berries: \n';
        array.forEach(element => {
            berries += capitalize(element.berry.name) + '\n';
        })

        return berries;
    }
    getBerriesByFirmnessMessage(response) {
        let array = response.berries.sort(function(a,b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });

        let berries = 'Berries: \n';
        array.forEach(element => {
            berries += capitalize(element.name) + '\n';
        })

        return berries;
    }
}

export default new PokemonAPI();