import movieRoute from './movieRoutes.js';

export default function route(app) {
  app.use('/api/v1/movies', movieRoute);
}
