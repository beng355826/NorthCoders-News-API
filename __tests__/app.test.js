const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
const sorted = require("jest-sorted")

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

    test('Should respond with a description of all available endpoints correctly formatted',() => {

        return request(app)
        .get("/api/")
        .expect(200)
        .then((body) => {

        for(const key in body._body){
        expect(body._body[key]).toHaveProperty("description", expect.any(String))
        expect(body._body[key]).toHaveProperty("queries", expect.any(Array))
        expect(body._body[key]).toHaveProperty("format", expect.any(String))
        expect(body._body[key]).toHaveProperty("exampleResponse", expect.any(Object))

            }
        
        })

    })

}) 























































































describe("GET /api/articles", () => {
    test("check the request returns a 200 and has the correct properties", () => {

        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {

        expect(body).toHaveLength(13)    
        body.forEach(article => {
        expect(article).toHaveProperty('author', expect.any(String))
        expect(article).toHaveProperty('title', expect.any(String))
        expect(article).toHaveProperty('article_id', expect.any(Number))
        expect(article).toHaveProperty('topic', expect.any(String))
        expect(article).toHaveProperty('created_at', expect.any(String))
        expect(article).toHaveProperty('votes', expect.any(Number))
        expect(article).toHaveProperty('article_img_url', expect.any(String))
        expect(article).toHaveProperty('commentCount', expect.any(Number))
        expect(article).not.toHaveProperty('body')

         })

        })

    })

    test("check the request returns in date descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((body) => {

        expect([body._body[0].created_at , body._body[1].created_at,body._body[5].created_at, body._body[9].created_at ]).toBeSorted({descending: true})

         })

        })


    })
