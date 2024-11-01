const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  num_mflix_comments: Number,
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  lastupdated: Date,
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  countries: [String],
  type: String,
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number
    },
    dvd: Date,
    lastUpdated: Date
  }
}
);

module.exports = class MoviesDB {
  constructor() {
    this.Movie = null;
  }

  initialize(connectionString) {
    

    return mongoose.connect(connectionString)
        .then(() => {
            this.Movie = mongoose.model("movies", movieSchema);
            console.log("connection established and movie model initialized");
           // resolve();
        })

        .catch((err) => {
            console.log("mongoDB connection error", err);
            //reject(err);
            throw err;
        });
    //});
  }

  async addNewMovie(data) {
 
    try {
        const newMovie = new this.Movie(data);
        return await newMovie.save();
      } catch (err) {
        console.error("error adding new movie: ", err);
        throw err; 
      }
  }

  async getAllMovies(page, perPage, title) {
  

    if (!(page) || !(perPage)) {
        throw new Error('page and perPage query parameters are not valid numbers');
      }
  
      const findBy = title ? { title: new RegExp(title, 'i') } : {};
      try {
        return await this.Movie.find(findBy)
          .sort({ year: 1 })
          .skip((page - 1) * +perPage)
          .limit(+perPage)
          .exec();
      } catch (err) {
        console.error("error retrieving movies: ", err);
        throw err; 
      }
  }

async getMovieById(id) {
    try {
      return await this.Movie.findOne({ _id: id }).exec();
    } catch (err) {
      console.error("error retrieving movie by id: ", err);
      throw err; 
    }
  }


async updateMovieById(data, id) {
    try {
      return await this.Movie.updateOne({ _id: id }, { $set: data }).exec();
    } catch (err) {
      console.error("error updating movie by id: ", err);
      throw err; 
    }
  }



async deleteMovieById(id) {
    try {
      return await this.Movie.deleteOne({ _id: id }).exec();
    } catch (err) {
      console.error("error deleting movie by id: ", err);
      throw err; 
    }
  }
}