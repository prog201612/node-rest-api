const express = require('express')
const crypto = require('node:crypto') // per crear un id únic
const { validateMovie } = require('./src/movies')
const movies = require('./src/movies.json')
const app = express()

// S e t t i n g s
app.disable('x-powered-by') // Oculta la cabecera X-Powered-By
const port = process.env.PORT || 3000

// M i d d l e w a r e s
app.use(express.json())

// R o u t e s
app.get('/', (req, res) => {
    res.json({ message: 'API REST' })
})

app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*') // CORS
    // recursos movies identificats amb la url /movies
    // Query String: /movies?genre=Action, objecte req.query
    const { genre } = req.query
    //if (genre) res.json(movies.filter(movie => movie.genre.includes(genre)))
    // La línia anterior funciona, però si ho volem case insensitive:
    if (genre) res.json(movies.filter(movie => 
        movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())))
    else res.json(movies)
})

app.get('/movies/:id', (req, res) => { // path-to-regexp: biblioteca que usa express
    // paràmetres de la url. Podem tenir vàris /movies/:id/:name
    // Regexp: /ab+cd/ => abcd, abbcd, abbbcd, ... normalment no ho utilitzarem
    const { id } = req.params // req.params.id
    const movie = movies.find(movie => movie.id === id)
    if (movie) res.json(movie)
    else res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
    // Validació de les dades, creem l'esquema de la pel·lícula
    const result = validateMovie(req.body)
    if (!result.success) {
        // podriem utilitzar un codi d'estat 422 (Unprocessable Entity)
        return res.status(400).json({ errors: result.error })
    }
    //const movie = req.body // <- No és recomanable, millor extreure les propietats
    // const { title, direction, duration, poster, rate, genre, year } = req.body
    // Excepte si ja tenim les dades validades amb zod
    const movie = {id: crypto.randomUUID(), ...result.data}
    // per crear un id únic tenim crypto de node.js
    // movie.id = crypto.randomUUID() // uuid v4 - randomBytes(16).toString('hex')
    movies.push(movie)
    res.status(201).json(movie)
})

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params
    const index = movies.findIndex(movie => movie.id === id)
    if (index === -1) return res.status(404).json({ message: 'Movie not found' })
    // si detectem el id al body, el descartem: 
    delete req.body.id
    // si utilitzem validatePartialMovie, no caldria eliminar el id ja que zod no el tindria en compte
    const result = validateMovie({ ...movies[index], ...req.body })
    // const result = validatePartialMovie(req.body)
    if (!result.success) return res.status(400).json({ errors: result.error })
    // movies[index] = { ...movies[index], ...result.data }
    movies[index] = { ...movies[index], ...req.body }
    res.json(movies[index])
})

// Idempotencia: propietat de realitzar una acció n vegades sense efectes secundaris
// PUT: actualitza un recurs, si no existeix el crea, és idempotent
// POST: crear un recurs, no és idempotent
// PATCH: actualitza parcialment un recurs, si és idempotent no garantitzat (updatetAt)

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const index = movies.findIndex(movie => movie.id === id)
    if (index === -1) return res.status(404).json({ message: 'Movie not found' })
    movies.splice(index, 1)
    res.json({ message: 'Movie deleted' })
})

// L i s t e n i n g
app.listen(port, () => {
  console.log(`Server URL:\x1b[35m http://localhost:${port} \x1b[0m`)
})
