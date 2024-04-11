import { Router } from 'express';
import Movie from '../models/films.js';
import movies from '../movies.json' assert { type: 'json' };
const movieRoute = Router();

movieRoute.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    let sort = req.query.sort || 'rating';
    let genre = req.query.genre || 'All';

    const genreOptions = [
      'Action',
      'Romance',
      'Fantasy',
      'Drama',
      'Crime',
      'Adventure',
      'Thriller',
      'Sci-fi',
      'Music',
      'Family',
    ];

    genre === 'All'
      ? (genre = [...genreOptions])
      : [(genre = req.query.genre.split(','))];
    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = 'asc';
    }

    const movies = await Movie.find({ name: { $regex: search, $options: 'i' } })
      .where('genre')
      .in([...genre])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Movie.countDocuments({
      genre: { $in: [...genre] },
      name: { $regex: search, $options: 'i' },
    });

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      genre: genreOptions,
      movies,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// const insertMovies = async () => {
//   try {
//     const docs = await Movie.insertMany(movies);
//     return Promise.resolve(docs);
//   } catch (error) {
//     return Promise.reject(err);
//   }
// };
// insertMovies()
//   .then((docs) => console.log(docs))
//   .catch((err) => console.log(err));
export default movieRoute;
