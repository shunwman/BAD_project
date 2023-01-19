import { Client } from 'pg';
import { Knex } from 'knex';
import Fungi from '../models/FungiModel';
import FungiFamilyNames from '../models/FungiFamilyNamesModel';

export default class FungiService {
    constructor(private knex: Knex, private client: Client) {
    }

    async getAllFungi(): Promise<Fungi[]> {
        const results: Fungi[] = await this.knex.select("*").from("fungi")
        return results
    }

    async getAllFungiWithFamilyName() {
        const results = await this.knex.raw(`
		select 
        fungi_family_names.name, 
        scientific_name, common_name, authority, synonym, descriptions, "location",
        habitat, local_distribution, "isNative", edibility, edibility_source 
        from fungi
        inner join fungi_family_names on family_id = fungi_family_names.id
        inner join fungi_locations on fungi.id = fungi_locations.fungus_id
        `)
        return results
    }

}