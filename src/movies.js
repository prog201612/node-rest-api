const z = require('zod') // per validar les dades

// z.string({invalid_type_error: 'El títol ha de ser una cadena', required_error: 'El títol és obligatori'})
const movieSchema = z.object({
    title: z.string().min(1).max(100),
    director: z.string().min(1).max(100),
    duration: z.number().int().positive(),
    poster: z.string().url(),
    rate: z.number().positive().max(10).default(5),
    genre: z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror']),
        { invalid_type_error: 'El gènere no és vàlid', required_error: 'El gènere és obligatori' }), 
    //z.array(z.string().min(1)).min(1),
    year: z.number().int().positive().min(1900).max(2100)
}) 
// .optiona(), .nullable(), .default(), .transform(), .refine(), .parse(), .partial(), .pick(), .omit(), .merge(), .extend()

function validateMovie (object) {
    // safeParse: retorna un objecte amb dues propietats, success i data
    return movieSchema.safeParse(object)
    // també tenim la versió asincrona: safeParseAsync
}

// validació parcial a l'hora de fer un PATCH (és una estratègia) no és la que he utilitzat
function validatePartialMovie (object) {
    // Converteix totes les propietats en opcionals i valida només les que ens passen
    return movieSchema.partial().safeParse(object)
}

module.exports = { validateMovie }