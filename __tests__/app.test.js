const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');
const Log = require('../lib/models/Log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [
          { amount: 2, measurement: 'cups', name: 'flour' },
          { amount: 1, measurement: 'bag', name: 'chocolate chips' },
          { amount: 1, measurement: 'egg', name: 'egg' }
        ] 
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            { amount: 2, measurement: 'cups', name: 'flour' },
            { amount: 1, measurement: 'bag', name: 'chocolate chips' },
            { amount: 1, measurement: 'egg', name: 'egg' }
          ] 
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets recipe by Id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        { amount: 2, measurement: 'cups', name: 'flour' },
        { amount: 1, measurement: 'bag', name: 'chocolate chips' },
        { amount: 1, measurement: 'egg', name: 'egg' }
      ] 
    });

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            { amount: 2, measurement: 'cups', name: 'flour' },
            { amount: 1, measurement: 'bag', name: 'chocolate chips' },
            { amount: 1, measurement: 'egg', name: 'egg' }
          ] 
        });
      });
  });

  it('updates a recipe by Id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        { amount: 2, measurement: 'cups', name: 'flour' },
        { amount: 1, measurement: 'bag', name: 'chocolate chips' },
        { amount: 1, measurement: 'egg', name: 'egg' }
      ] 
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [
          { amount: 2, measurement: 'cups', name: 'flour' },
          { amount: 1, measurement: 'bag', name: 'chocolate chips' },
          { amount: 1, measurement: 'egg', name: 'egg' }
        ] 
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            { amount: 2, measurement: 'cups', name: 'flour' },
            { amount: 1, measurement: 'bag', name: 'chocolate chips' },
            { amount: 1, measurement: 'egg', name: 'egg' }
          ] 
        });
      });
  });

  it('deletes a recipe by Id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        { amount: 2, measurement: 'cups', name: 'flour' },
        { amount: 1, measurement: 'bag', name: 'chocolate chips' },
        { amount: 1, measurement: 'egg', name: 'egg' }
      ] 
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            { amount: 2, measurement: 'cups', name: 'flour' },
            { amount: 1, measurement: 'bag', name: 'chocolate chips' },
            { amount: 1, measurement: 'egg', name: 'egg' }
          ] 
        });
      });
  });

  it('creates a log', async() => {

    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    return await request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2020-12-04',
        notes:'pretty good',
        rating: 4
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2020-12-04',
          notes: 'pretty good',
          rating: 4
        });
      });
  });

  it('gets all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const logs = await Promise.all([
      { recipeId: recipe.id, dateOfEvent: '2020-12-04', notes:'pretty good', rating: 4 },
      { recipeId: recipe.id, dateOfEvent: '2020-12-04', notes:'alright', rating: 3 },
      { recipeId: recipe.id, dateOfEvent: '2020-12-04', notes:'could be better', rating: 2 },
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('get log by Id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({ 
      recipeId: recipe.id, 
      dateOfEvent: '2020-12-04', 
      notes:'pretty good', 
      rating: 4 
    });

    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id, 
          dateOfEvent: '2020-12-04', 
          notes:'pretty good', 
          rating: 4 
        });
      });
  });

  it('update log by Id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({ 
      recipeId: recipe.id, 
      dateOfEvent: '2020-12-04', 
      notes:'pretty good', 
      rating: 4 
    });

    const newLog = await Log.insert({ 
      recipeId: recipe.id, 
      dateOfEvent: '2020-12-04', 
      notes:'extremely good', 
      rating: 5 
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send(newLog)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id, 
          dateOfEvent: '2020-12-04', 
          notes:'extremely good', 
          rating: 5 
        });
      });
  });

  it('delete log by Id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({ 
      recipeId: recipe.id, 
      dateOfEvent: '2020-12-04', 
      notes:'pretty good', 
      rating: 4 
    });

    return request(app)
      .delete(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id, 
          dateOfEvent: '2020-12-04', 
          notes:'pretty good', 
          rating: 4 
        });
      });
  });
});
