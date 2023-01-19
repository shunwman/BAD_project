import { Client } from 'pg';
import { hashPassword } from '../hash';
import User from '../models/UserModel'
//import Knex from 'knex';

// import UserSController from "../controllers/UserController";


export default class UserService{
    constructor(private knex: any, private client: Client){}

    async getUsers(): Promise<User[]> {
       const results:User[] = (await this.client.query(/* sql */ `SELECT * FROM apples`)).rows
        return results;
    }
    async register(username:string,password:string){
     let hashedPassword = await hashPassword(password)
		//await this.client.query(
		//	`insert into users (username, password) values ($1, $2)`,
		//	[username, hashedPassword]
		//)
        const ids = await this.knex.insert({username: username, password: hashedPassword,}).into("users").returning("id")
    }
    async getUser(username:string){
        const result = await this.knex.select("username", "password", "id","created_at","updated_at").from("users")
                        .where("username", username)
        console.log(result[0])
        let dbUser:User = result[0]
        console.log(dbUser)
       return dbUser;
    }
    async googleLogin(email:string) {
        const users = (
            await this.client.query(`SELECT * FROM users WHERE username = $1`, [
                email
            ])
        ).rows
        let user: User= users[0]
        return user;
    }
    async googleAddUser(email:string){
        return (await this.client.query(
            `INSERT INTO users (username,password)
            VALUES ($1,$2) RETURNING *`,
            [email, ""]
        )).rows[0] as User
    }
}