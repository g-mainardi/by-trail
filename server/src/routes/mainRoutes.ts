import express from 'express';

export const mainRoutes = express.Router();

mainRoutes.get('/', (req, res) => {
  res.send('Hello, World!');
});
