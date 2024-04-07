import { randomUUID } from 'node:crypto'
import { readJSON } from '../utils.js'

const movies = readJSON('./movies.json')

export class MovieModel {

  static async getAll({ genre })  {
    if (genre) return movies.filter(movie =>
      movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return movies
  }

  static async getById ({ id })  {
    const movie = movies.find(movie => movie.id === id)
    if (movie) return(movie)
  }

  static async create ({ input }) {
    const movie = {id: randomUUID(), ...input}
    movies.push(movie)
    return movie
  }

  static async delete ({ id }) {
    const index = movies.findIndex(movie => movie.id === id)
    if (index === -1) return false
    movies.splice(index, 1)
    return true
  }

  static async update ({ id, input }) {
    const index = movies.findIndex(movie => movie.id === id)
    if (index === -1) return false
    movies[index] = { ...movies[index], ...input }
    return movies[index]
  
  }
}

// Fem els mètodes async pensant en un futur ja que així englobem tots els cassos
// Utilitzem objectes com a paràmetres per si més endavant s'ha d'extendre