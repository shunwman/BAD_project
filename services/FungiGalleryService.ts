import { Client } from 'pg';
import { Knex } from 'knex';
import FungiGallery from '../models/FungiGalleryModel';

export default class FungusGallery {
    constructor(private knex: Knex,private client: Client) {
    }
    
    async getAllFungiImages(): Promise<FungusGallery[]> {
        const results: FungusGallery[] = await this.knex.select("*").from("fungi_gallery");
        return results
    }

}