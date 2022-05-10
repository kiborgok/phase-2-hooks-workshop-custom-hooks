import styled from "styled-components";
import React, { useEffect, useState, useReducer } from "react";

/* ✅ modify this usePokemon custom hook to take in a query as an argument */

function pokemonReducer(state, action) {
  switch (action.type) {
    case "pending":
      return { data: null, errors: null, status: "pending" };
    case "fulfilled":
      return { data: action.payload, errors: null, status: "fulfilled" };
    case "rejected":
      return { data: null, errors: action.payload, status: "rejected" };
    default:
      return state;
  }
}
export function usePokemon(query) {
  /* ✅ this hook should only return one thing: an object with the pokemon data */
  const initialState = {
    data: null,
    errors: null,
    status: "idle",
  };
  const [{ data, errors, status }, dispatch] = useReducer(
    pokemonReducer,
    initialState
  );

  useEffect(() => {
    dispatch({ type: "pending" });
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then(r => {
        if (r.ok) {
          return r.json();
        } else {
          return r.text().then(err => {
            throw err;
          });
        }
      })
      .then(res => dispatch({ type: "fulfilled", payload: res }))
      .catch(err => dispatch({ type: "rejected", payload: [err] }));
  }, [query]);
  return { data, errors, status };
}

function Pokemon({ query }) {
  /* 
   ✅ move the code from the useState and useEffect hooks into the usePokemon hook
   then, call the usePokemon hook to access the pokemon data in this component
  */
  const { data: pokemon, errors, status } = usePokemon(query);

  // 🚫 don't worry about the code below here, you shouldn't have to touch it
  if (status === "idle" || status === "pending") return <h3>Loading...</h3>;

  if (status === "rejected") {
    return (
      <div>
        <h3>Error</h3>
        {errors.map(e => (
          <p key={e}>{e}</p>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3>{pokemon.name}</h3>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name + " front sprite"}
      />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("charmander");

  function handleSubmit(e) {
    e.preventDefault();
    setQuery(e.target.search.value);
  }

  return (
    <Wrapper>
      <h1>PokéSearcher</h1>
      <Pokemon query={query} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" defaultValue={query} />
        <button type="submit">Search</button>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  display: grid;
  place-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: papayawhip;
  text-align: center;

  h1 {
    background: #ef5350;
    color: white;
    display: block;
    margin: 0;
    padding: 1rem;
    color: white;
    font-size: 2rem;
  }

  form {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
  }
`;
