import { checkPassword } from "../hash"


describe("hash",()=>{
    test("check password",async ()=>{
        let matched=await checkPassword("tecky","$2a$10$ZorT0wxbFJBWqp1uy3uItuD8PaWMQIIu5H3AvOTYiCDBuXQeWMI72")
        expect(matched).toBe(true)
    })
})