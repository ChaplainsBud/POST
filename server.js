
const express = require('express');
const router = express.Router();  // what's this?
const morgan = require('morgan');  // logger
const bodyParser = require('body-parser');  // json needs parsing here?

const {ShoppingList, Recipes} = require('./models');  // file of models
// still not sure what it means to model and persist for databases

const jsonParser = bodyParser.json();  // does this method mean non-json is an option?
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

// adding some recipes to `Recipes` so there's something
// to retrieve.
Recipes.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);

// when the root of this router is called with GET, return
// all current ShoppingList items

app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.post('/shopping-list', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});

app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
})

app.post('/recipes', jsonParser, (req, res) => {
  // ensure name and ingredients are in request body
 const requiredFields = ['name', 'ingredients'];
 for (let i = 0; i < requiredFields.length; i++) {
  const field = requiredFields[i];
  if(!(field in req.body)) {
    const message = `Missing \`${field}\` in request body`
    console.error(message);
    return res.status(400).send(message);
  }
 }
 const item = Recipes.create(req.body.name, req.body.ingredients);
 res.status(201).json(item);
})


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
