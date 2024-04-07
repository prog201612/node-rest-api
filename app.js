import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

// S e t t i n g s
app.disable('x-powered-by') // Oculta la cabecera X-Powered-By
const port = process.env.PORT || 3000

// M i d d l e w a r e s
app.use(corsMiddleware())
app.use(json())

// R o u t e s
app.get('/', (req, res) => {
    res.json({ message: 'API REST' })
})

// Movies
app.use('/movies', moviesRouter)

// L i s t e n i n g
app.listen(port, () => {
  console.log(`Server URL:\x1b[35m http://localhost:${port} \x1b[0m`)
})
