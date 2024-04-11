import { Router } from 'express';
import Movie from '../models/films.js';
// import movies from '../movies.json' assert { type: 'json' };
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
movieRoute.get('/', async (req, res) => {
  try {
    // We destructure the req.query object to get the page and limit variables from url
    const { page = 1, limit = 10 } = req.query;
    const movies = await Movie.find({ ...req.query })
      // We multiply the "limit" variables by one just to make sure we pass a number and not a string
      .limit(limit * 1)
      // I don't think i need to explain the math here
      .skip((page - 1) * limit)
      // We sort the data by the date of their creation in descending order (user 1 instead of -1 to get ascending order)
      .sort({ createdAt: -1 });

    // Getting the numbers of products stored in database
    const count = await Movie.countDocuments();

    return res.status(200).json({
      movies,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
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
