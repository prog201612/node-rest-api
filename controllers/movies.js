import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { MovieModel } from '../models/moovie.js'

export class MoviesController {
    static async getAll (req, res)  {
        const { genre } = req.query
        const movies = await MovieModel.getAll({ genre })
        return res.json(movies)
    }
    
    static async getById (req, res) { 
        const { id } = req.params 
        const movie = await MovieModel.getById({id})
        if (movie) res.json(movie)
        else res.status(404).json({ message: 'Movie not found' })
    }

    static async create (req, res)  {
        // Fer les validacions a les rutes té la seva polèmica
        const result = validateMovie(req.body)
        if (!result.success) {
            return res.status(400).json({ errors: result.error })
        }
        const movie = await MovieModel.create({input: result.data})
        res.status(201).json(movie)
    }

    static async update (req, res) {
        const result = validatePartialMovie(req.body)
        if (!result.success) return res.status(400).json({ errors: result.error })
        const { id } = req.params
    
        const updatedMovie = await MovieModel.update({id, input: result.data})
        if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' })
        else res.json(updatedMovie)
    }

    static async delete (req, res) {
        const { id } = req.params
        const ok = await MovieModel.delete({id})
        if (!ok) return res.status(404).json({ message: 'Movie not found' })
        else res.json({ message: 'Movie deleted' })
    }
}

// Al utilitzar async / await cal gestionar els errors amb try / catch
// ho farem més endavant utilitzant un middleware d'errors