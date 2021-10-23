import express from "express"
import cors from "cors"
import producto from "./api/producto.route.js"
<<<<<<< HEAD
=======
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
>>>>>>> 086565316ef8e3f4e151d80cbeb8830fea3ef96c

const app = express()

app.use(cors())
app.use(express.json())

<<<<<<< HEAD
=======
var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://prana-personalizados.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'api-autenticación-prana-personalizados',
  issuer: 'https://prana-personalizados.us.auth0.com/',
  algorithms: ['RS256']
});

app.use(jwtCheck)


>>>>>>> 086565316ef8e3f4e151d80cbeb8830fea3ef96c
app.use("/api/v1/producto", producto)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app
