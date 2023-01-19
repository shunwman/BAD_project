import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.dropTableIfExists("searching_history")
    await knex.schema.dropTableIfExists("mushroom_info")
    await knex.schema.dropTableIfExists("users")
    await knex.schema.dropTableIfExists("mushrooms")

}


export async function down(knex: Knex): Promise<void> {

    const hasUsers = await knex.schema.hasTable("users")
    if (!hasUsers) {
        await knex.schema.createTable("users", (table) => {
            table.increments();
            table.string("username").notNullable()
            table.string("password").notNullable()
            table.timestamps(false, false)
        })
    } else {

    }

    const hasMushrooms = await knex.schema.hasTable("mushrooms")
    if (!hasMushrooms) {
        await knex.schema.createTable("mushrooms", (table) => {
            table.increments();
            table.string("family_name").notNullable()
            table.string("zh_family_name").notNullable()
            table.string("scientific_name").notNullable()
            table.string("zh_name").notNullable()
            table.string("common_name").notNullable()
        })
    }

    const hasMushroom_info = await knex.schema.hasTable("mushroom_info")

    if (!hasMushroom_info) {
        await knex.schema.createTable("mushroom_info", (table) => {
            table.increments()
            table.integer("mushroom_id").references("mushrooms.id").unsigned().notNullable()
            table.string("sample_image").notNullable()
            table.string("authority").notNullable()
            table.string("synonym").notNullable()
            table.boolean("native").notNullable()
            table.string("descriptions").notNullable()
            table.string("habitat").notNullable()
            table.string("local_distribution").notNullable()
            table.boolean("edible").notNullable()
        })
    }


    const hasSearching_history = await knex.schema.hasTable("searching_history")

    if (!hasSearching_history) {
        await knex.schema.createTable("searching_history", (table) => {
            table.increments()
            table.integer("mushroom_id").references("mushrooms.id").unsigned().notNullable()
            table.timestamps(false, false)
        })
    }



}

