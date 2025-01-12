import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    async function loadPokemonList() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000'); 
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error('Failed to load Pokémon list:', error);
      }
    }
    loadPokemonList();
  }, []);

  useEffect(() => {
    if (!selectedPokemon) return;
    async function fetchPokemonDetails() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);
        const data = await response.json();
        setPokemonDetails(data);
      } catch (error) {
        console.error('Failed to fetch Pokémon details:', error);
      }
    }
    fetchPokemonDetails();
  }, [selectedPokemon]);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(query)
    );
    setFilteredSuggestions(filtered);
  };

  const handleSuggestionClick = (pokemonName) => {
    setSearchQuery(pokemonName);
    setSelectedPokemon(pokemonName);
    setFilteredSuggestions([]); 
  };

  const handleSearch = () => {
    setSelectedPokemon(searchQuery.toLowerCase());
  };

  const getStatProgress = (statValue) => {
    return (statValue / 255) * 100; 
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fw-bold text-default">Find Pokemons</h1>

      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              id="pokemonInput"
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Pokémon name or ID"
              value={searchQuery}
              onChange={handleSearchInput}
            />
            <button id="searchBtn" className="btn btn-primary btn-lg" onClick={handleSearch}>
              Search
            </button>
          </div>
          {/* Suggestions List */}
          {filteredSuggestions.length > 0 && (
            <ul className="list-group">
              {filteredSuggestions.map((pokemon, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(pokemon.name)}
                >
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Dropdown for Pokémon Selection */}
      <div className="row justify-content-center mb-4">
      <h2 className="text-center mb-4 fw-bold text-default"> Or Select a Pokemon</h2>
        <div className="col-md-6">
          <select
            id="pokemonDropdown"
            className="form-select form-select-lg"
            value={selectedPokemon}
            onChange={(e) => setSelectedPokemon(e.target.value)}
          >
            <option selected disabled>Choose a Pokémon from the list</option>
            {pokemonList.map((pokemon, index) => (
              <option key={index} value={pokemon.name}>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pokémon Info Card */}
      {pokemonDetails && (
        <div className="pokemon-card">
          <div className="pokemon-image-container">
          {/* <img
              src={pokemonDetails.sprites.other['showdown'].front_default}
              alt={pokemonDetails.name}
              className="pokemon-image"
            /> */}
            <img
              src={pokemonDetails.sprites.other['home'].front_default}
              alt={pokemonDetails.name}
              className="pokemon-image"
            />
             <img
              src={pokemonDetails.sprites.other['home'].front_shiny}
              alt={pokemonDetails.name}
              className="pokemon-image"
            />
            <img
              src={pokemonDetails.sprites.other['official-artwork'].front_default}
              alt={pokemonDetails.name}
              className="pokemon-image"
            />
             <img
              src={pokemonDetails.sprites.other['official-artwork'].front_shiny}
              alt={pokemonDetails.name}
              className="pokemon-image"
            />
          </div>
          <div className="pokemon-info">
            <div className="info-tile">
              <h3>{pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}</h3>
              {/* <p><strong>ID:</strong> {pokemonDetails.id}</p> */}
            </div>
            <div className="info-tile">
              <h4>Types</h4>
              {pokemonDetails.types.map((type) => (
                <span key={type.type.name} className="badge bg-primary me-1">
                  {type.type.name}
                </span>
              ))}
            </div>
            <div className="info-tile">
              <p><strong>Height:</strong> {pokemonDetails.height} Inches</p>
              <p><strong>Weight:</strong> {pokemonDetails.weight} Kilograms</p>
            </div>
            <div className="info-tile">
              <h4>Stats</h4>
              {pokemonDetails.stats.map((stat) => (
                <div key={stat.stat.name} className="mb-3">
                  <label htmlFor={stat.stat.name} className="form-label">{stat.stat.name.toUpperCase()}</label>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${getStatProgress(stat.base_stat)}%` }}
                      aria-valuenow={stat.base_stat}
                      aria-valuemin="0"
                      aria-valuemax="255"
                    >
                      {stat.base_stat}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
