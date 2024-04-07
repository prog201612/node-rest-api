import cors from 'cors'

const ACCEPTED_ORIGINS = [
	'http://localhost:8080',
	'http://127.0.0.1:3000'
]

export const corsMiddleware = ({ ao = ACCEPTED_ORIGINS} = {}) => cors ({
	origin: (origin, callback) => {
		if (ao.includes(origin)) {
			return callback(null, true)
		}

		if (!origin) return callback(null, true)
		return callback(new Error('Not allowed by CORS'))
	}
})

// no és bona pràctica posar `*' als cors, aquí una possible solució