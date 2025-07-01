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
app.get("/pokemon", async (req, res) => {
  try {
    res.json(pokedex);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.json([]);
    } else {
      res.status(500).json({ error: "Failed to retreive pokemon" });
    }
  }
});

//get pokemon by dex number
app.get("/pokemon/:id", async (req, res) => {
  try {
    const PKMNID = parseInt(req.params.id);
    //validation check if id is not greater than 0 or exceeds array length
    if (PKMNID <= 0 || PKMNID > pokedex.length) {
      res.json({
        error: `A pokemon with that ID has not been documented yet.`,
      });
    }
    res.json(pokedex[PKMNID - 1]);
  } catch (error) {
    if (error.code === "ENOENT") {
      res
        .status(404)
        .json({ error: "A pokemon with the ID has not been documented yet" });
    } else {
      res.status(500).json({ error: "Failed to retreive pokemon" });
    }
  }
});

//get all matching pokemon
app.get("/search", async (req, res) => {
  try {
    const ability = req.query.abilities;
    const matchingPokemon = pokedex.filter(
      (pokemon) =>
        Array.isArray(pokemon.abilities) && pokemon.abilities.includes(ability)
    );
    if (matchingPokemon.length > 0) {
      res.json({ "Here are the pokemon you're looking for!": matchingPokemon });
    } else {
      error.json({ error: "No pokemon meet that criteria." });
    }
  } catch (error) {
    res.status(404).json({ error: "No such pokemon exists." });
  }
});

//add a new pokemon to the dex
app.post("/pokemon", async (req, res) => {
  try {
    const {
      name,
      hitPoints,
      attack,
      defense,
      description,
      abilities,
      evolution,
      image,
      id,
    } = req.body;
    if (
      !name ||
      !hitPoints ||
      !attack ||
      !defense ||
      !description ||
      !abilities ||
      !evolution ||
      !image ||
      !id
    ) {
      return res.status(422).json({
        error:
          "All fields must be entered. If not applicable, enter a blank object or string!",
      });
    }
    const newPKMN = {
      name,
      hitPoints,
      attack,
      defense,
      description,
      abilities,
      evolution,
      image,
      id,
    };

    pokedex.push(newPKMN);

    res.status(201).json({
      message: "pokemon added!",
      newentry: newPKMN,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "something went wrong trying to add a 'mon." });
  }
});
