import express from 'express'
// import { Knex } from "knex";
import {knex} from "../app"
import FungiService from '../services/FungiService';
import FungiGalleryService from '../services/FungiGalleryService';
import { request } from 'http';
// import { appendFile } from 'fs';

export const fungiRoutes = express.Router()

// export function initialize(knex:Knex, client:any) {
//     client.connect().then(() => {
//         // const service = new FungiService(knex, client)
//         const service = new FungiService(knex, client)
//         // const controller = new FungiGalleryService(knex, client)
//         fungiRoutes.get('/')
//     })
// }

fungiRoutes.use(express.json())

fungiRoutes.get("/fungiData", getFungiData)
fungiRoutes.post("/fungiDataAlternative", getFungiDataAlternative)

async function getFungiDataAlternative(req: express.Request, res: express.Response){
    console.log("route - /fungiDataAlternative")
    //console.log("id: " + req.body['fungus_id'])
    //try{
	const fungiIdForSearch = parseInt(req.body['fungus_id'])
    const fungiDataInSQL = await knex.select("family_id","scientific_name", "common_name", "authority", "synonym", "descriptions", "habitat", "local_distribution", "isNative", "edibility", "edibility_source") 
    .from("fungi")
    .where("id", fungiIdForSearch)

    const fungiFamilyNameInSQL =  await knex.select("name")
    .from("fungi_family_names")
    .where("id", fungiDataInSQL[0].family_id)
    //console.log(fungiFamilyNameInSQL[0])
    let fungiLocations ;
    const fungiLocationInSQL =  await knex.select("location", "location_name")
    .from("fungi_locations")
    .where("fungus_id", fungiIdForSearch)
    console.log(fungiLocationInSQL[0])
    if (fungiLocationInSQL[0] === undefined){
        fungiLocations = null
    }else{
        fungiLocations = fungiLocationInSQL
    }

    // get location name

    let fungiLocationNames = [] ;
    const fungiLocationNameInSQL = await knex.select("location_name")
    .from("fungi_locations")
    .where("fungus_id", fungiIdForSearch)
    // console.log(fungiLocationNameInSQL[0])
    for (let i = 0; i < fungiLocationNameInSQL.length; i++) {
        if (fungiLocationNameInSQL[i]["location_name"] === 'na') {
            console.log("the index", i, "location is NA")
        } else {
            fungiLocationNames.push(fungiLocationNameInSQL[i])
            console.log(fungiLocationNameInSQL[i])
        }
    }


    
    res.json({fungiData: fungiDataInSQL[0], fungiFamilyName: fungiFamilyNameInSQL[0].name, fungiLocations : fungiLocations, fungiLocationNames: fungiLocationNames})
   
    
}

async function getFungiData(req: express.Request, res: express.Response) {

    let fungiData = await knex.raw(`
    select fungi.id, fungi_family_names.name, scientific_name, common_name, authority, synonym, descriptions, habitat, local_distribution, "isNative", edibility, edibility_source from fungi
    inner join fungi_family_names
    on family_id = fungi_family_names.id
    `)

    res.json({data: fungiData.rows})
}