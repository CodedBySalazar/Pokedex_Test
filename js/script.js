let pokemonData = [];
let actualPokemonData = [];

fetchPokedexData();

async function fetchPokedexData(name = "kanto") {
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

async function fetchPokemonData(pokemonName) {
  try {
    let evolution_names = [];

    const basicData = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const pokemon = await basicData.json();

    const special_data = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
    );
    const specie = await special_data.json();

    evolution_names = await getEvolutionChain(specie);

    pokemonData.push({
      id: pokemon.id,
      name: pokemon.name,
      weight: pokemon.weight,
      height: pokemon.height,
      species: specie.genera
        .find((g) => g.language.name === "en")
        .genus.split(" ")[0],
      abilities: pokemon.abilities.map((a) => a.ability.name),
      types: pokemon.types.map((t) => t.type.name),
      egg_groups: specie.egg_groups.map((g) => g.name),
      principal_image: pokemon.sprites.other["official-artwork"].front_default,
      secondary_image: pokemon.sprites.front_default,
      evolution_names: evolution_names,
    });
  } catch (error) {
    console.error(`Error fetching data for ${pokemonName}:`, error.message);
  }
}

async function getEvolutionChain(specie) {
  let evolution_names = [];

  if (specie.evolution_chain && specie.evolution_chain.url) {
    try {
      const evolutionChainResponse = await fetch(specie.evolution_chain.url);
      const evolutionChain = await evolutionChainResponse.json();
      evolution_names = extractEvolutionNames(evolutionChain.chain);
    } catch (e) {
      console.error(
        `Error fetching evolution chain for ${pokemonName}:`,
        e.message
      );
    }
  }

  return evolution_names;
}

function extractEvolutionNames(chain) {
  const names = [];

  function traverse(node) {
    if (!node) return;
    names.push(node.species.name);
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((child) => traverse(child));
    }
  }
  traverse(chain);
  return names;
}

function displayPokemonData(filteredPokemons = pokemonData) {
  const pokemonList = document.getElementById("pokemon-list");
  pokemonList.innerHTML = "";

  filteredPokemons.forEach((pokemon) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
    listItem.onclick = () => { getSelectedPokemon(pokemon.name);};

    listItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <img src="${pokemon.secondary_image}" alt="${
      pokemon.name
    }" class="img-fluid" style="max-width: 50px;">
                <span class="fw-bold ps-2 text-white">${pokemon.name}</span>
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

function getSelectedPokemon(pokemonName) {
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
  const $specie = $("#pokemonSpecie");
  const $eggGroups = $("#eggGroups");
  const $abilities = $("#abilities");

  $imageSrc.attr("src", actualPokemonData.principal_image);
  $name.text(convertFirstLetterUpperCase(actualPokemonData.name));

  $typesContainer.empty();
  actualPokemonData.types.forEach((type) => {
    $typesContainer.append(
      `<span class="badge-type text-dark py-2 px-4 px-md-5 rounded mx-2 mx-md-3 mb-2 mb-md-0">${convertFirstLetterUpperCase(
        type
      )}</span>`
    );
  });

  $weight.text(`${actualPokemonData.weight / 10} kg`);
  $height.text(`${actualPokemonData.height / 10} m`);
  $specie.text(convertFirstLetterUpperCase(actualPokemonData.species));

  $eggGroups.empty();
  $eggGroups.text(
    actualPokemonData.egg_groups
      .map((group) => convertFirstLetterUpperCase(group))
      .join(" and ")
  );

  $abilities.empty();
  $abilities.text(
    actualPokemonData.abilities
      .map((ability) => convertFirstLetterUpperCase(ability))
      .join(", ")
  );

  addImagesEvolutions();
}

function addImagesEvolutions() {
  const evolutionsImages = [];

  actualPokemonData.evolution_names.forEach((evolutionName) => {
    const pokemon = pokemonData.find((p) => p.name === evolutionName);
    if (pokemon) {
      evolutionsImages.push({
        name: convertFirstLetterUpperCase(pokemon.name),
        image: pokemon.principal_image,
      });
    }
  });

  addEvolutionChainToview(evolutionsImages);
}

function addEvolutionChainToview(evolutionsImages) {
  const $evolutionsContainer = $("#evolutionChainContainer");
  $evolutionsContainer.empty();

  evolutionsImages.forEach((evolution, index) => {
    const isLast = index === evolutionsImages.length - 1;

    const $evolutionDiv = $(`
        <div class="col-4 col-sm-3 col-md-2 d-flex flex-column align-items-center">
          <img src="${evolution.image}" alt="${evolution.name}" class="img-fluid">
          <span class="mt-2 fw-bold text-center">${evolution.name}</span>
        </div>
      `);

    $evolutionsContainer.append($evolutionDiv);

    if (!isLast) {
      $evolutionsContainer.append(`
            <i class="bi bi-arrow-right text-danger fs-1 mx-3"></i>
        `);
    }
  });
}
$(".searchInput").on("input", function () {
  const searchPokemon = $(this).val().toLowerCase();

  const filteredPokemons = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchPokemon)
  );

  displayPokemonData(filteredPokemons);

  if (searchPokemon === "") {
    displayPokemonData(pokemonData);
  }
});

$("#pokemon-list").on("click", "li", function (e) {
  $("#pokemon-list li").removeClass("active-pokemon");

  $(this).addClass("active-pokemon");
});

function orderPokemons() {
  pokemonData.sort((a, b) => a.id - b.id);
}

function convertFirstLetterUpperCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
