const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")


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

describe("Error message 404 sent when incorrect api request is sent when parametric input is not required ", () => {
    test("responds with an error 404 when the Get request can not be found", () => {
            return request(app)
            .get("/api/topic")
            .expect(404)

}) })









































describe('GET /api/articles/:article_id', () => {


    test("responds with the correct row corresponding to the correct article id", () => {
        
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((body) => {

       expect(body._body).toHaveProperty('article_id', expect.any(Number))
       expect(body._body).toHaveProperty('title', expect.any(String))
       expect(body._body).toHaveProperty('topic', expect.any(String))
       expect(body._body).toHaveProperty('author', expect.any(String))
       expect(body._body).toHaveProperty('body', expect.any(String) )
       expect(body._body).toHaveProperty('created_at', expect.any(String) )
       expect(body._body).toHaveProperty('votes', expect.any(Number))
       expect(body._body).toHaveProperty('article_img_url', expect.any(String))

        })


    })


    test("responds with the correct error message when sent an invalid type (not a number)", () => {
        
        return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then((body) => {

        expect(body._body).toMatchObject({
            msg:'400 - invalid type request'
        })

        })

    })

    test("responds with the correct error message when sent a correct type but invalid", () => {
        
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then((body) => {

        expect(body._body).toMatchObject({
            msg:'404 - not found'
        })

        })

})

})








