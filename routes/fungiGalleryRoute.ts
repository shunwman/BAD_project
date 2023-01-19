import express from 'express'
import { logger } from '../logger'
// import jsonfile from 'jsonfile'
import { knex } from "../app"
import { isloggedin } from '../guard'
import { client, io } from '../app'
import { formParseBetter } from '../upload'
import { request } from 'http'
export const fungiGalleryRoutes = express.Router()

fungiGalleryRoutes.get('/loadGallery', loadImagesFromGallery)
fungiGalleryRoutes.post('/loadComments', loadCommentsFromUsers)
fungiGalleryRoutes.post('/postComment', uploadUserComment)

async function loadImagesFromGallery(req: express.Request, res: express.Response) {
    // console.log('s')
    try {
        // original
        // const fungiGalleryData = await knex.raw(`
        // select fungi_gallery.id, users.username, fungus_id, fungi.scientific_name, image_name, status
        // from fungi_gallery
        // inner join fungi
        // on fungus_id = fungi.id
        // left join users
        // on user_id = users.id
        // `)

        // new 
        const fungiGalleryDataWithComments = await knex.raw(`
        with 
        latest_comment as (
            select 
            max(updated_at) as lateset_ts, fungi_gallery_id 
            from fungi_gallery_comments fgc 
            group by (fungi_gallery_id)
        ),
        uploaded_record as(
                select 
                fungi_gallery.id as fungi_gallery_id, 
                users.username as upload_by, 
                fungus_id, fungi.scientific_name, image_name, status
                from fungi_gallery
                inner join fungi
                on fungus_id = fungi.id
                left join users
                on user_id = users.id
        ),
        comment_record as (
            select 
            fgc.id as fgc_id,
            fgc.fungi_gallery_id ,
            fgc.updated_at as fgc_updated_at,
            comment,
            user_id,
            username
            from latest_comment 
            inner join fungi_gallery_comments fgc on lateset_ts = fgc.updated_at 
            inner join users on users.id = user_id
        )
        select 
        uploaded_record.*,
        comment_record.fgc_id,
        comment_record.comment,
        comment_record.username,
        comment_record.user_id,
        comment_record.fgc_updated_at
        from uploaded_record left join comment_record on uploaded_record.fungi_gallery_id = comment_record.fungi_gallery_id
        `)
            // v old 
        // res.json({ data: fungiGalleryData.rows, allData: fungiGalleryDataWithComments.rows })
        
        res.json({ allData: fungiGalleryDataWithComments.rows })
    } catch (err) {
        console.log(err)
    }


}

async function loadCommentsFromUsers(req: express.Request, res: express.Response) {
    // res.status({successful})
    try {
        const imageId = req.body.imageIndex
        const userId = req.session['user']
        console.log('clicked image with id:',imageId)
        // console.log('user id:',userId)

        let imageData = await knex
        .select("fungi.id","scientific_name", "fungi_gallery.image_name", "users.username") 
        .from("fungi")
        .leftJoin("fungi_gallery","fungi_gallery.fungus_id", "fungi.id")
        .leftJoin("users", "users.id" , "user_id")
        .where("fungi_gallery.id", imageId)

        // console.log(imageData)

        let commentData = await knex
        .select("fungi_gallery.id", "users.username", "fungi.scientific_name", "fungi_gallery_comments.comment") 
        .from("fungi_gallery")
        .leftJoin ("fungi_gallery_comments", "fungi_gallery_comments.fungi_gallery_id", "fungi_gallery.id")
        .leftJoin ("users", "fungi_gallery_comments.user_id", "users.id")
        .leftJoin ("fungi", "fungi_gallery.fungus_id", "fungi.id")
        .where("fungi_gallery_comments.fungi_gallery_id", imageId)
        
        // console.log(commentData)

        res.json({imageId:imageId, userId:userId, imageInfo: imageData, comments: commentData })

    } catch (err) {
        console.log(err)
    }
}

async function uploadUserComment(req: express.Request, res: express.Response) {

    try {
        let userId = req.session["user"]
        
        const uploadedData = req.body
        if (userId == uploadedData.userId) {
            console.log(uploadedData)

            let imgId = uploadedData.imageId
            let commentInput = uploadedData.comment

            await knex.insert({
                fungi_gallery_id: imgId,
                user_id: userId,
                comment: commentInput
            }).into("fungi_gallery_comments")

            

            let commentData = await knex
            .select("fungi_gallery.id", "users.username", "fungi.scientific_name", "fungi_gallery_comments.comment") 
            .from("fungi_gallery")
            .leftJoin ("fungi_gallery_comments", "fungi_gallery_comments.fungi_gallery_id", "fungi_gallery.id")
            .leftJoin ("users", "fungi_gallery_comments.user_id", "users.id")
            .leftJoin ("fungi", "fungi_gallery.fungus_id", "fungi.id")
            .where("fungi_gallery_comments.fungi_gallery_id", imgId)

            res.json({msg: "uploaded comment", reload: commentData})

        } else {

            console.log("someone is hacking on comment session")
            res.json({msg: "hello hacker"})
            return
        }


    } catch (err) {
        console.log(err)

    }
}

// v not using v

fungiGalleryRoutes.put('/', async (req, res) => {
    try {

        const index = req.body.index

        if (!index || !Number(index)) {
            res.status(400).json({
                message: 'index is invalid'
            })
            return
        }

        logger.debug('index : ' + index)

        await client.query(`update fungi set content = $1 where id = $2`, [
            Number(index)
        ])
        res.json({
            message: 'success'
        })
        return
    } catch (err: any) {
        console.log(err.message)
        logger.error(err.message)

        res.status(400).send('Update error: ' + err.message)
        return
    }
})

fungiGalleryRoutes.delete('/', isloggedin, async (req, res) => {
    try {
        const index = req.body.index

        if (!index || !Number(index)) {
            res.status(400).json({
                message: 'index is invalid'
            })
            return
        }
        await client.query('delete from fungi where id = $1', [Number(index)])
        res.json({
            message: 'del success'
        })
    } catch (e) {
        console.log('error : ' + e)
        res.status(500).json({
            message: 'del fail'
        })
    }
})

fungiGalleryRoutes.get('/', async (req, res) => {
    const fungiResult = await client.query(
        'SELECT * from fungi ORDER BY created_at desc'
    )

    res.json(fungiResult.rows)
    return
})



// v only using for now v

fungiGalleryRoutes.post('/formidable', async (req, res) => {
    try {
        console.log('post- formidable')

        const {
            filename: image,

        } = await formParseBetter(req)


        res.json({
            message: 'Upload successful'
        })
    } catch (e) {
        console.log(e)
        res.status(400).send('Upload Fail')
        return
    }
})


fungiGalleryRoutes.post('/contact', async (req, res) => {
    try {
        let fungus_id: Number = 0;
        const fungiList = ["Agaricus trisulphuratus", "Chlorophyllum molybdites", "Leucocoprinus birnbaumii", "Amanita exitialis",
            "Amanita farinosa", "Amanita pseudoporphyria", "Auricularia cornea",
            "Gymnopilus aeruginosus", "Pseudosperma rimosum", "Phallus multicolor", "Ganoderma applanatum",
            "Ganoderma lingzhi", "Ganoderma tropicum", "Pseudofavolus tenuis", "Pycnoporus sanguineus",
            "Sanguinoderma rugosum", "Trametes versicolor", "Coprinellus micaceus", "Schizophyllum commune",
            "Xylobolus spectabilis"]
        console.log('post- formidable contact')
        //console.log(req)
        const {
            filename: image,
            fields
        } = await formParseBetter(req)
        for (let i = 0; i < fungiList.length; i++) {
            if (fungiList[i] === fields.fungiName) {
                fungus_id = i + 1
            }
        }
        console.log('fungiList=' + fungus_id)
        console.log(fields)
        let gallery_ids;
        if (fields.userId === "null"){
        const gallery_ids = await knex.insert({ user_id: null, fungus_id: fungus_id, image_name: image })
            .into("fungi_gallery").returning("id")
        const location_ids = await knex.insert({id:gallery_ids[0].id, location_name: fields.locationName, location: fields.location, fungus_id: fungus_id })
        .into("fungi_locations").returning("id")
           // console.log(typeof fungi_gallery_ids)
           console.log(gallery_ids)
           console.log(location_ids)
        }else{
        const gallery_ids = await knex.insert({ user_id: fields.userId, fungus_id: fungus_id, image_name: image })
        .into("fungi_gallery").returning("id")
           // console.log(typeof fungi_gallery_ids)
           console.log(gallery_ids)
           console.log(gallery_ids[0].id)
        const location_ids = await knex.insert({id:gallery_ids[0].id, location_name: fields.locationName, location: fields.location, fungus_id: fungus_id })
        .into("fungi_locations").returning("id")
                   console.log(location_ids)
        }


        res.json({
            message: 'Upload successful'
            
        })
    } catch (e) {
        console.log(e)
        res.status(400).send('Upload Fail')
        return
    }

})