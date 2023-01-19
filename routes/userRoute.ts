let SERVER_IP = "localhost:8080"
import express from 'express';
import { Client } from 'pg';
import UserService from '../services/UserService';
import UserController from '../controllers/UserController';
import { Server as SocketIO } from 'socket.io'
import Knex from 'knex';
const knexConfigs = require("../knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

export const userRoutes = express.Router();

export function initialize(client: Client, io: SocketIO) {
    const userService = new UserService(knex, client);
    const userController = new UserController(userService, io);
    userRoutes.get('/', userController.getUsers)
    userRoutes.post('/register', userController.register)
    userRoutes.post('/login', userController.login)
    userRoutes.get('/login/google', userController.loginGoogle)
    userRoutes.get('/logout', userController.logout)
    userRoutes.get('/me', userController.me)
}
