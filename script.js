let pokemonData = [];
let actualPokemonData = [];

fetchPokedexData();

async function fetchPokedexData(name = "Kanto") {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokedex/${name.toLowerCase()}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokedex data:", error);
    return null;
  }
}

fetchPokedexData().then((data) => {
  if (data) {
    const entries = data.pokemon_entries;
    const promises = entries.map((entry) => {
      const pokemonName = entry.pokemon_species.name;
      return fetchPokemonData(pokemonName);
    });

    Promise.all(promises).then(() => {
      orderPokemons();
      displayPokemonData();
    });
  }
});

function orderPokemons() {
  pokemonData.sort((a, b) => a.id - b.id);
}

async function fetchPokemonData(pokemonName) {
  try {
    const basicData = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const pokemon = await basicData.json();

    const special_data = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
    );
    const specie = await special_data.json();

    pokemonData.push({
      id: pokemon.id,
      name: pokemon.name,
      weight: pokemon.weight,
      height: pokemon.height,
      abilities: pokemon.abilities.map((a) => a.ability.name),
      types: pokemon.types.map((t) => t.type.name),
      egg_groups: specie.egg_groups.map((g) => g.name),
      principal_image: pokemon.sprites.other["official-artwork"].front_default,
      secondary_image: pokemon.sprites.front_default,
    });

  } catch (error) {
    console.error(`Error fetching data for ${pokemonName}:`, error.message);
  }
}

function displayPokemonData() {
  const pokemonList = document.getElementById("pokemon-list");

  pokemonData.forEach((pokemon) => {
    const listItem = document.createElement("li");
    listItem.className =
      "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
    listItem.onclick = () => {
      getPokemon(pokemon.name);
    };

    listItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <img src="${pokemon.secondary_image}" alt="${
      pokemon.name
    }" class="img-fluid" style="max-width: 50px;">
                <span class="fw-bold ps-2">${pokemon.name}</span>
            </div>
            <div>
                <span class="badge bg-danger rounded-pill">#${pokemon.id
                  .toString()
                  .padStart(3, "0")}</span>
            </div>
        `;

    pokemonList.appendChild(listItem);
  });
}

function getPokemon(pokemonName) {
  const selectedPokemon = pokemonData.find((p) => p.name === pokemonName);

  if (selectedPokemon) {
    actualPokemonData = selectedPokemon;
    showActualPokemon();
  }
}

function showActualPokemon() {
  const $imageSrc = $("#pokemonImage");
  const $name = $("#pokemonName");
  const $typesContainer = $("#pokemonTypes");
  const $weight = $("#pokemonWeight");
  const $height = $("#pokemonHeight");
  const $eggGroups = $("#eggGroups");
  const $abilities = $("#abilities");

  $imageSrc.attr("src", actualPokemonData.principal_image);
  $name.text(actualPokemonData.name.charAt(0).toUpperCase() + actualPokemonData.name.slice(1));
  
  $typesContainer.empty();
  actualPokemonData.types.forEach((type) => {
    $typesContainer.append(`<span class="badge-type text-dark py-2 px-5 rounded mx-3">${type}</span>`);
  });

  $weight.text(`${actualPokemonData.weight / 10} kg`);
  $height.text(`${actualPokemonData.height / 10} m`);

  $eggGroups.empty();
  $eggGroups.text(actualPokemonData.egg_groups.join(" and "));

  $abilities.empty();
  $abilities.text(actualPokemonData.abilities.join(", "));
  
}