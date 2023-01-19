import express from 'express'
import expressSession from 'express-session'
import { initialize as initializeUserRoutes, userRoutes } from './routes/userRoute'


// knex setup
import Knex from 'knex'
const knexConfigs = require("./knexfile")
let configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);


import { Client } from 'pg'
import dotenv from 'dotenv'
dotenv.config()
export const client = new Client({
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
})

import fs from 'fs'
import { uploadDir } from './upload'
import { logger } from './logger'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
import grant from 'grant'
import { fungiGalleryRoutes } from './routes/fungiGalleryRoute'
import { fungiRoutes } from './routes/fungiRoute'
import { uploadRoutes } from './routes/uploadRoute'
// import { initialize as initializeFungiRoutes, fungiRoutes } from './routes/fungiRoute'

declare module 'express-session' {
	interface SessionData {
		name?: string
		isloggedin?: boolean
	}
}

const app = express()
const server = new http.Server(app)
export const io = new SocketIO(server)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let sessionMiddleware = expressSession({
	secret: 'Tecky Academy teaches typescript',
	resave: true,
	saveUninitialized: true
})

app.use(sessionMiddleware)
const grantExpress = grant.express({
	defaults: {
		// origin: 'http://192.168.59.115:8080',
		origin: 'http://localhost:8080',
		transport: 'session',
		state: true
	},
	google: {
		key: process.env.GOOGLE_CLIENT_ID || '',
		secret: process.env.GOOGLE_CLIENT_SECRET || '',
		scope: ['profile', 'email'],
		callback: '/user/login/google'
	}
})

app.use(grantExpress as express.RequestHandler)


io.use((socket, next) => {
	let req = socket.request as express.Request
	let res = req.res!
	sessionMiddleware(req, res, next as express.NextFunction)
})

// initializeUserRoutes(client, io)

initializeUserRoutes(client, io)
// initializeFungiRoutes(knex, client)

app.use('/user', userRoutes)
app.use('/fungi', fungiRoutes)
app.use('/fungi_gallery',fungiGalleryRoutes)

// Auto create a folder
fs.mkdirSync(uploadDir, { recursive: true })

app.use(express.static('uploads'))
app.use(express.static('public')) // auto to do next()
app.use(express.static('public/pages'))
app.use('/uploads', express.static('uploads')) // auto to do next()
io.on('connection', function (socket) {
	console.log('new socket connected: ', socket.id)


})
server.listen(8080, () => {
	logger.info('Listening on port 8080')
})

