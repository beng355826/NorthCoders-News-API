const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
// const { selectTopics } = require("../models/get-api-topics.model")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})



describe('GET /api/topics', () => {
    test('responds with a 200 status code when request is successful', () => {

        return request(app)
        .get("/api/topics")
        .expect(200)
      
    })

    test('responds with all the topics', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {

            body.AllTopics.forEach(topic => {
                expect(topic).toHaveProperty('slug', expect.any(String))
                expect(topic).toHaveProperty('description', expect.any(String))
            })

        });

    })

})

describe("Error message 404 when sent a bad request", () => {
    test("responds with an error 404 when the Get request can not be found", () => {
            return request(app)
            .get("/api/topic")
            .expect(404)

}) })

describe("GET /api/", () => {

    test('Should respond with a status of 200 when the correct request is sent',() => {

        return request(app)
        .get("/api/")
        .expect(200)
        .then(({body}) => {
            expect(body.msg).toBe("200 - request successful");
        });

    })

})

