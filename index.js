const { error } = require("console");
const express = require("express");
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

// Middleware
app.use(express.json());

const fs = require("fs");
// import data from pokemon.json
const pokedex = JSON.parse(fs.readFileSync("./pokemon.json", "utf8"));

//app is listening
app.get("/", async (req, res) => {
  res.send({ healthcheck: "app is working" });
  console.log("health good");
});

//get all pokemon in the pokedex
app.get("/pokemon");

//get pokemon by dex number
app.get("/pokemon/:id", async (req, res) => {
  try {
    const PKMNID = parseInt(req.params.id);
    //validation check if id is not greater than 0 or exceeds array length
    if (PKMNID < 0 || PKMNID > pokedex.length) {
      error(`A pokemon of with that ID has not been documented yet.`);
    }
    res.json(pokedex.indexof[PKMNID - 1]);
  } catch {}
});

//get all matching pokemon
app.get("/search");

//add a new pokemon to the dex
app.post("/pokemon");
