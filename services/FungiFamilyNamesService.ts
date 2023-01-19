import { Client } from 'pg';
import {Knex} from 'knex';
import FungiFamilyNames from '../models/FungiFamilyNamesModel';

export default class FungiFamilyNamesService {
    constructor(private knex: Knex, private client: Client) {
    }

    async getFamilyNames(): Promise<FungiFamilyNames[]> {
        const results: FungiFamilyNames[] = await this.knex.select("*").from("fungi_family_names")
        return results
    }

    // async getFamilyName(family_name_id: number) {
    //     let result = (await this.knex.select("name").from("fungi_family_names").where({id: family_name_id}))
    //     return result
    // }

}