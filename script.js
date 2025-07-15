let pokemonData = [];
let ActualPokemonData = [];

async function fetchPokedexData(name = "Kanto") {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokedex/${name.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();;
        return data;
    } catch (error) {
      console.error("Error fetching Pokedex data:", error);
      return null;
    }
} 

fetchPokedexData().then(data => {
    if (data) {
        const pokemonEntries = data.pokemon_entries;
        for (entry of pokemonEntries) {
            const pokemonName = entry.pokemon_species.name;
            fetchPokemonData(pokemonName);
            
        }
    }
});

async function fetchPokemonData(pokemonName) {
    try {
      const basicData = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemon = await basicData.json();

      const special_data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
      const specie = await special_data.json();

      pokemonData.push({
        id: pokemon.id,
        name: pokemon.name,
        weight: pokemon.weight,
        height: pokemon.height,
        abilities: pokemon.abilities.map((a) => a.ability.name),
        types: pokemon.types.map((t) => t.type.name),
        egg_groups: specie.egg_groups.map((g) => g.name),
        image: pokemon.sprites.other["official-artwork"].front_default,
      });
    } catch (error) {
        console.error(`Error fetching data for ${pokemonName}:`, error.message);
    }

}