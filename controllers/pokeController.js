function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
}

export class PokeController {
    getPokemonDataMessage (response) {
        const name = '\u{27A1} ' + response.names.filter(pokeAPIName => pokeAPIName.language.name === 'en')[0].name;
        const rate = '\u{1F5C2} ' + response.is_legendary
            ? '\u{1F451} Legendary pokemon'
            : response.is_mythical
                ? '\u{1F31F} Epic pokemon'
                : '\u{2B50} Ordinary pokemon';
        const description = '\u{1F4C3} ' + response.flavor_text_entries.filter(pokeAPIName => pokeAPIName.language.name === 'en')[11].flavor_text;
        const color = '\u{1F3A8} Color: ' + response.color.name;

        let  eggGroup = '\u{1F95A} Egg group: ';
        if (!Array.isArray(response.egg_groups)) {
            eggGroup += response.egg_groups[0].name;
        }
        else {
            response.egg_groups.forEach(element => {
                eggGroup += element.name + ', ';
            });
            eggGroup = eggGroup.slice(eggGroup.length - 2);
        }

        const baseHappiness = '\u{1F600} Base happiness: ' + response.base_happiness;
        const captureRate = '\u{1F340} Capture rate: ' + response.capture_rate;

        let habitat = '\u{1F5FA} Habitat: ';
        if(response.habitat !== null) {
            if (!Array.isArray(response.habitat)) {
                habitat += response.habitat.name;
            } else {
                response.habitat.forEach(element => {
                    habitat += element.name + ', ';
                });
                habitat = habitat.slice(habitat.length - 2);
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
            + captureRate + '\n\n'
            + forms + '\n'
            + genderDiff;

        return message;
    } ///
    getNatureDataMessage (response) {
        const increasedStat = '\u{1F4C8} Increased stat: ' + response.increased_stat.name;
        const decreasedStat = '\u{1F4C9} Decreased stat: ' + response.decreased_stat.name;
        const likesFlavor = '\u{1F44D} Likes flavor: ' + response.likes_flavor.name;
        const hatesFlavor = '\u{1F44E} Hates flavor: ' + response.hates_flavor.name;

        const message =
            increasedStat + '\n'
            + decreasedStat + '\n'
            + likesFlavor + '\n'
            + hatesFlavor;

        return message;
    } ///
    getTypeDataMessage (response) {
        const damageType = '\u{2694} Damage type: ' + response.move_damage_class.name;
        let moves = '\u{1F44A} Moves: \n';

        const array = response.moves.sort(function(a,b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });

        array.forEach(element => {
            moves += capitalize(element.name) + '\n';
        })

        return  damageType + '\n\n' + moves;
    } ///
    getHabitatPokemonsMessage(response) {
        let pokemons = '';

        const array = response.pokemon.sort(function(a,b) {
            return a.pokemon.name > b.pokemon.name ? 1 : b.pokemon.name > a.pokemon.name ? -1 : 0;
        });

        array.forEach(element => {
            pokemons += '\u{1F63A} ' + capitalize(element.pokemon.name) + '\n';
        })

        return pokemons;
    } ///
    getAllTypePokemonsMessage (response) {
        let pokemons = '';

        const array = response.pokemon.sort(function(a,b) {
            return a.pokemon.name > b.pokemon.name ? 1 : b.pokemon.name > a.pokemon.name ? -1 : 0;
            });

        array.forEach(element => {
            pokemons += '\u{1F63A} ' + capitalize(element.pokemon.name) + '\n';
        })

        return pokemons;
    } ///
    getAllPokemonsMessage (response) {
        let pokemons = '';

        const array = response.pokemon_species.sort(function(a,b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });

        array.forEach(element => {
            pokemons += '\u{1F63A} ' + capitalize(element.name) + '\n';
        })

        return pokemons;
    } ///

    getBerryByNameMessage (response) {
        const name = '\u{27A1} ' + capitalize(response.name);
        const firmness = '\u{1FAA8} Firmness: ' + response.firmness.name;

        let array = response.flavors.sort(function(a,b) {
            return a.flavor.name > b.flavor.name ? 1 : b.flavor.name > a.flavor.name ? -1 : 0;
        });

        let flavor = '\u{1F365} Flavors: ';
        array.forEach(element => {
            flavor += element.flavor.name + ', ';
        })
        flavor = flavor.slice(flavor.length - 2);

        let power_type = '\u{1F5C2} Natural gift type: ' + response.natural_gift_type.name;

        const growth_time = '\u{23F1} Growth time: ' + response.growth_time;
        const max_harvest = '\u{1F331} Max harvest: ' + response.max_harvest;
        const power = '\u{1F4AB}Natural gift power: ' + response.natural_gift_power;
        const smoothness = '\u{1F335} Smoothness: ' + response.smoothness;
        const soil_dryness = '\u{1F4A7} Soil dryness: ' + response.soil_dryness;

        return name + '\n\n'
            + growth_time + '\n'
            + max_harvest + '\n'
            + power + '\n'
            + power_type + '\n'
            + flavor + '\n\n'
            + firmness + '\n'
            + smoothness + '\n'
            + soil_dryness;
    }///
    getBerriesByFlavorMessage(response) {
        let array = response.berries.sort(function(a,b) {
            return a.berry.name > b.berry.name ? 1 : b.berry.name > a.berry.name ? -1 : 0;
        });

        let berries = '';
        array.forEach(element => {
            berries += '\u{1F347} ' + capitalize(element.berry.name) + '\n';
        })

        return berries;
    }///
    getBerriesByFirmnessMessage(response) {
        let array = response.berries.sort(function(a,b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });

        let berries = '';
        array.forEach(element => {
            berries += '\u{1F347}' + capitalize(element.name) + '\n';
        })

        return berries;
    }///

    getItemByNameMessage(response) {
        const name = '\u{27A1} ' + capitalize(response.name);
        const category = '\u{1F5C2} Category: ' + response.category.name;
        const description = response.effect_entries[0].effect;
        const cost = '\u{1F4B8} Cost: ' + response.cost;

        let array = response.attributes.sort(function(a,b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });

        let attributes = '\u{1F4C3} Attributes: ';
        array.forEach(element => {
            attributes += element.name + ', ';
        })
        attributes = attributes.slice(attributes.length - 2);

        return name + '\n'
            + category + '\n\n'
            + description + '\n'
            + attributes + '\n\n'
            + cost;
    } ///
    getItemsByAttributeMessage(response) {
        const description = response.descriptions[0].description;

        let array = response.items.sort(function(a,b) {
            return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        });

        let items = '';
        array.forEach(element => {
            items += '\u{1F9F3}' + capitalize(element.name) + '\n';
        })

        return description + '\n\n' + items;
    } ///
}

export default new PokeController();