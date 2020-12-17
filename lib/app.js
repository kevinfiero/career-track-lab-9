const express = require('express');
const Recipe = require('./models/Recipe');
const Log = require('./models/Log');
const app = express();

app.use(express.json());

app.post('/api/v1/recipes', (req, res) => {
  Recipe
    .insert(req.body)
    .then(recipe => res.send(recipe));
});

app.get('/api/v1/recipes', (req, res) => {
  Recipe
    .find()
    .then(recipes => res.send(recipes));
});

app.get('/api/v1/recipes/:id', (req, res, next) => {
  Recipe
    .findById(req.params.id)
    .then(recipe => res.send(recipe))
    .catch(next);
});

app.put('/api/v1/recipes/:id', (req, res, next) => {
  Recipe
    .update(req.params.id, req.body)
    .then(recipe => res.send(recipe))
    .catch(next);
});

app.delete('/api/v1/recipes/:id', (req, res, next) => {
  Recipe
    .delete(req.params.id)
    .then(recipe => res.send(recipe))
    .catch(next);
});

app.post('/api/v1/logs', (req, res) => {
  Log
    .insert(req.body)
    .then(log => res.send(log));
});

app.get('/api/v1/logs', (req, res) => {
  Log
    .find()
    .then(log => res.send(log));
});

app.get('/api/v1/logs/:id', (req, res, next) => {
  Log
    .findById(req.params.id)
    .then(log => res.send(log))
    .catch(next);
});

app.put('/api/v1/logs/:id', (req, res, next) => {
  Log
    .update(req.params.id, req.body)
    .then(log => res.send(log))
    .catch(next);
});

app.delete('/api/v1/logs/:id', (req, res, next) => {
  Log
    .delete(req.params.id)
    .then(log => res.send(log))
    .catch(next);
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
