import express from 'express'
import { logger } from '../logger'
// import jsonfile from 'jsonfile'
import { knex } from "../app"
import { isloggedin } from '../guard'
import { client, io } from '../app'
import { formParseBetter } from '../upload'
import { request } from 'http'
export const uploadRoutes = express.Router()

uploadRoutes.post('/postLocation', uploadUserLocation)


async function uploadUserLocation(req: express.Request, res: express.Response) {

    try {
        let userId = req.session["user"]
        if (userId) {
            //insert location data with user id
            knex.insert({
                location: location,
                user_id: userId,
            }).into("fungi_locations")
            
        } else {
            //insert location data without user id
            knex.insert({
                location: location,
            }).into("fungi_locations")

        }
        res.json({ data: "uploaded location" })

    } catch (err) {
        console.log(err)

    }
}