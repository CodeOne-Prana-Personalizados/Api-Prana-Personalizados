import express from "express"
import cors from "cors"
import producto from "./api/producto.route.js"
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const app = express()

app.use(cors())
app.use(express.json())


app.use("/api/v1/producto", producto)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app