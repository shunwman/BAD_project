1.yarn install
2.create a database called fungi
3.create the tables: 
    yarn knex migrate:latest
4.get seed data:
    yarn knex seed:run

if problem exists in database:
1. yarn knex migrate:down (drop table)
2. yarn knex migrate:up (create table again)