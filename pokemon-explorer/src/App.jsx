import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState('');

  // Fetch a list of Pokémon
  useEffect(() => {
    async function loadPokemonList() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error('Failed to load Pokémon list:', error);
      }
    }
    loadPokemonList();
  }, []);

  // Fetch the selected Pokémon details
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

  const handleSearch = () => {
    setSelectedPokemon(searchQuery.toLowerCase());
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fw-bold text-primary">Pokémon Explorer</h1>

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button id="searchBtn" className="btn btn-primary btn-lg" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
      {/* Dropdown for Pokémon Selection */}
      <div className="row justify-content-center mb-4">
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
          <img
              src={pokemonDetails.sprites.other['home'].front_default}
              alt={pokemonDetails.name}
              className="pokemon-image"
            />
            <hr/>
          <img
              src={pokemonDetails.sprites.other['official-artwork'].front_default}
              alt={pokemonDetails.name}
              className="pokemon-image"
            />
          </div>
          <div className="pokemon-info">
            <div className="info-tile">
              <h3>{pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}</h3>
              <p><strong>ID:</strong> {pokemonDetails.id}</p>
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
              <p><strong>Height:</strong> {pokemonDetails.height} decimetres</p>
              <p><strong>Weight:</strong> {pokemonDetails.weight} hectograms</p>
            </div>
            <div className="info-tile">
              <h4>Stats</h4>
              {pokemonDetails.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <strong>{stat.stat.name}:</strong> {stat.base_stat}
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
