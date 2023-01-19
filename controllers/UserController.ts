import UserService from "../services/UserService";
import SocketIO from 'socket.io';
import { Request, Response } from 'express';
import { checkPassword } from "../hash";
import fetch from 'cross-fetch'



export default class UserController{
    private service:UserService;
    private io:SocketIO.Server;
    constructor(service: UserService,
                io: SocketIO.Server){
                    this.service=service;
                    this.io=io;
                }
    getUsers = async (req: Request, res: Response) => {
        res.json(await this.service.getUsers());
    }
    register = async (req: Request, res: Response) => {
        console.log('userRoutes - [/register]')
        try {
            const username = req.body.username
            const password = req.body.password
            
            if (!username || !password) {
                res.status(400).json({
                    message: 'Invalid username or password'
                })
                return
            }

            this.service.register(username, password)

            res.json({ message: 'User created' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    login = async (req: Request, res: Response) => {
        console.log('userRoutes - [/login]')
        const username = req.body.username
        const password = req.body.password
        if (!username || !password) {
            res.status(400).json({
                message: 'Invalid username or password'
            })
            return
        }

        let dbUser = await this.service.getUser(username)
        if (!dbUser) {
            res.status(400).json({
                message: 'Invalid username or password'
            })
            return
        }

        let isMatched = await checkPassword(password, dbUser.password)
        if (!isMatched) {
            res.status(400).json({
                message: 'Invalid username or password'
            })
            return
        }
        let {
            password: dbUserPassword,
            id,
            created_at,
            updated_at,
            ...sessionUser
        } = dbUser
        
        req.session['user'] = dbUser.id
        console.log("user: " + req.session['user'] )
        res.status(200).json({
            message: 'Success login'
        })
    }
    loginGoogle=async (req: Request, res: Response)=> {
        // 如果google in 成功，就會拎到 一個 access token
        // access token 係用黎換番google 既 user profile
        const accessToken = req.session?.['grant'].response.access_token
    
        // fetch google API, 拎 user profile
        const fetchRes = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
                method: 'get',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        const googleProfile = await fetchRes.json()
        let user = await this.service.googleLogin(googleProfile.email)
    
        if (!user) {
            user = await this.service.googleAddUser(googleProfile.email)
        }
        if (req.session) {
            req.session['user'] = googleProfile
        }
        res.redirect('/')
    
    }
    logout=async (req: Request, res: Response) => {
        req.session.destroy(() => {
            console.log('user logged out')
        })
        res.redirect('/')
    }
    me=async (req: Request, res: Response) => {
		res.json({
			message: 'Success retrieve user',
			data: {
				user: req.session['user'] ? req.session['user'] : null
			}
		})
	}
}
