import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasUsers = await knex.schema.hasTable("users")
    if (!hasUsers) {
        await knex.schema.createTable("users", (table) => {
            table.increments()
            table.string("username").notNullable()
            table.string("password").notNullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }

    const hasFamilyNames = await knex.schema.hasTable("fungi_family_names")
    if (!hasFamilyNames) {
        await knex.schema.createTable("fungi_family_names", (table) => {
            table.increments();
            table.string("name").notNullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }

    const hasMushrooms = await knex.schema.hasTable("fungi")
    if (!hasMushrooms) {
        await knex.schema.createTable("fungi", (table) => {
            table.increments();
            table.integer("family_id").references("fungi_family_names.id").notNullable()
            table.string("scientific_name").notNullable()
            table.string("common_name").nullable()
            table.string("authority").notNullable()
            table.string("synonym").nullable()
            table.text("descriptions").notNullable()
            table.text("habitat").notNullable()
            table.text("local_distribution").notNullable()
            table.boolean("isNative").notNullable()
            // v whether you can eat it 
            table.text("edibility").nullable() // as it can be 'no data' 
            // ^ can be edible/ inedible/ psychoactive/ poisonous/ deadly/ unknown
            table.text("edibility_source").nullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }

    const hasLocations = await knex.schema.hasTable("fungi_locations")
    if (!hasLocations) {
        await knex.schema.createTable("fungi_locations", (table) => {
            table.increments();
            table.integer("user_id").references("users.id").nullable();
            table.point("location").notNullable(); // < coordinate of the fungus
            // ^ nullable as users may chose to report a new location without using GPS
            table.text("location_name").nullable()
            table.integer("fungus_id").references("fungi.id").notNullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }

    const hasUserMushrooms = await knex.schema.hasTable("fungi_gallery")
    if (!hasUserMushrooms) {
        await knex.schema.createTable("fungi_gallery", (table) => {
            table.increments();
            table.integer("user_id").references("users.id").nullable()
            // ^ nullable as the image may come from the system
            // ^ users can upload their image of fungi await for approval
            table.integer("fungus_id").references("fungi.id").notNullable()
            table.text("image_name").notNullable()
            table.text("status").notNullable().defaultTo("pending")
            // ^ shows whether the image is approved to be displayed
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }

    const hasFungiGalleryComments = await knex.schema.hasTable("fungi_gallery_comments")
    if (!hasFungiGalleryComments) {
        await knex.schema.createTable("fungi_gallery_comments", (table) => {
            table.increments();
            table.integer("fungi_gallery_id").references("fungi_gallery.id").notNullable()
            table.integer("user_id").references("users.id").notNullable()
            table.text("comment").notNullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("fungi_gallery_comments")
    await knex.schema.dropTableIfExists("fungi_gallery")
    await knex.schema.dropTableIfExists("fungi_locations")
    await knex.schema.dropTableIfExists("fungi")
    await knex.schema.dropTableIfExists("fungi_family_names")
    await knex.schema.dropTableIfExists("users")

}

