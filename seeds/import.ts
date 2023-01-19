import { Knex } from "knex";
import XLSX from "xlsx";
interface FamilyNames {
    name: string
}

interface Fungi {
    family_id: number
    scientific_name: string
    common_name?: string
    authority: string
    synonym?: string
    descriptions: string
    habitat: string
    local_distribution: string
    isNative: boolean
    edibility?: string
    edibility_source: string
    location: number
}

interface Fungi_Locations {
    location: string
    location_name: string
    fungus_id: number
}

interface Fungi_Gallery {
    fungus_id: number
    image_name: string
    status: string

}

export async function seed(knex: Knex): Promise<void> {
    try {
        // Deletes ALL existing entries


        await knex.raw(`truncate table fungi_gallery_comments RESTART identity cascade`)
        await knex.raw(`truncate table fungi_gallery RESTART identity cascade`)
        await knex.raw(`truncate table fungi_locations RESTART identity cascade`)
        await knex.raw(`truncate table fungi RESTART identity cascade`)
        await knex.raw(`truncate table fungi_family_names RESTART identity cascade`)
        await knex.raw(`truncate table users RESTART identity cascade`)


        // Inserts seed entries
        // A) import data from excel
        let workbook = XLSX.readFile('./seeds/import-data.xlsx');
        let familyNames: FamilyNames[] = XLSX.utils.sheet_to_json(workbook.Sheets['fungi_family_names']);
        let fungiData: Fungi[] = XLSX.utils.sheet_to_json(workbook.Sheets['fungi']);

        let fungiLocations: Fungi_Locations[] = XLSX.utils.sheet_to_json(workbook.Sheets['fungi_locations']);
        let fungiGallery: Fungi_Gallery[] = XLSX.utils.sheet_to_json(workbook.Sheets['fungi_gallery']);

        // console.log(fungiLocations);
        // console.log(fungiGallery);

        await knex.insert(familyNames).into("fungi_family_names")//.returning("id")
        console.log("FamilyNames inserted successfully")

        await knex.insert(fungiData).into("fungi")
        console.log("Fungi inserted successfully")

        await knex.insert(fungiLocations).into("fungi_locations")
        console.log("Fungi Locations inserted successfully")

        await knex.insert(fungiGallery).into("fungi_gallery")
        console.log("Fungi Gallery inserted successfully")

    } catch (err) {
        console.log("Seed failed: " + err.message)
    }

};





//v bin
        // let familyNames_id: Number[] = []

        // for (let i = 1; i <= familyNames.length; i++) {
        //     familyNames_id.push({id: i, family: 1})
        // }
        // console.log(familyNames_id)

        // await knex("table_name").insert([
        //     { id: 1, colName: "rowValue1" },
        //     { id: 2, colName: "rowValue2" },
        //     { id: 3, colName: "rowValue3" }
        // ]);

        // await knex("fungi_family_names").insert([{
        //     id: 1,
        // },
        // {

        // }

        // ])