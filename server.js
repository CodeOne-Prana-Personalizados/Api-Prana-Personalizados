import express from "express"
import cors from "cors"
import producto from "./api/producto.route.js"
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const app = express()

app.use(cors())
app.use(express.json())

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


app.use("/api/v1/producto", producto)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app