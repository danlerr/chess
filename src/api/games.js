const BASE_URL = "http://localhost:3001/games";

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
  return res.json();
}

export const listGame = () => request(BASE_URL)

export const createGame = (game) => request(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game),
})

export const updateGame = (id, patch) => request(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
})

export const deleteGame = (id) => request(`${BASE_URL}/${id}`, {
    method: "DELETE",
})