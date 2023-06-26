const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
const { selectTopics } = require("../models/get-api-topics.model")

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
        .then(({body}) => {
            expect(body.msg).toBe("200 - request successful");
        });

    })

    test('responds with all the topics', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.AllTopics).toEqual([
                { slug: 'mitch', description: 'The man, the Mitch, the legend' },
                { slug: 'cats', description: 'Not dogs' },
                { slug: 'paper', description: 'what books are made of' }
              ]);
        });

    })

    test('responds with an error 404 when the Get request can not be found', () => {
        return request(app)
        .get("/api/topic")
        .expect(404)
        
     })

    

})

