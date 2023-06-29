const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
const sorted = require("jest-sorted")

const {deleteController} = require("../controllers/delete-comment.controller")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})




describe(' Challenge 2 - GET /api/topics', () => {

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



describe(" Challenge 3 - GET /api/", () => {


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


 
describe(' Challenge 4 - GET /api/articles/:article_id', () => {

    test("responds with the correct row corresponding to the correct article id", () => {
        
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((body) => {

       expect(body._body).toHaveProperty('article_id', 1)
       expect(body._body).toHaveProperty('title', 'Living in the shadow of a great man')
       expect(body._body).toHaveProperty('topic', 'mitch' )
       expect(body._body).toHaveProperty('author', 'butter_bridge' )
       expect(body._body).toHaveProperty('body', 'I find this existence challenging' )
       expect(body._body).toHaveProperty('created_at', '2020-07-09T20:11:00.000Z' )
       expect(body._body).toHaveProperty('votes', 100 )
       expect(body._body).toHaveProperty('article_img_url', 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700' )


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


describe(" Challenge 5 - GET /api/articles", () => {

    test("Check the request returns a 200 and has the correct properties", () => {

        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {

        expect(body.articles).toHaveLength(13)    
        body.articles.forEach(article => {
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
      
      test("Check the request returns in date descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {

        expect(body.articles).toBeSortedBy('created_at', {descending : true})

        })

    })

})

    
describe("Challenge 6 - GET /api/articles/:article_id/comments", () => {

    test('responds with an array of comments with the correct properties', () => {

        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body}) => {

            
            expect(body.comments).toHaveLength(2)

            body.comments.forEach(comment => {
                expect(comment).toHaveProperty('comment_id', expect.any(Number))
                expect(comment).toHaveProperty('votes', expect.any(Number))
                expect(comment).toHaveProperty('created_at', expect.any(String))
                expect(comment).toHaveProperty('author', expect.any(String))
                expect(comment).toHaveProperty('body', expect.any(String))
                expect(comment).toHaveProperty('article_id', 3)
            })
        })
    })

    test('Comments should be served with the most recent comments first.', () => {

        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {

        expect(body.comments).toBeSortedBy('created_at', {descending:true})

        })
    })


    test("returns a 200, when valid ID exists but no comments.", () => {

        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {

        expect(body).toMatchObject({ comments: [] })

        })
        
    })


    test('returns a 404 - when an incorrect article_id is given', () => {

        return request(app)
        .get('/api/articles/2000/comments')
        .expect(404)
        .then(({body}) => {


            expect(body).toMatchObject({
                msg : '404 - not found'
            })
        })
    })

    test('returns a 400 - when an invalid type is sent in the GET request', () => {

        return request(app)
        .get('/api/articles/NotAnId/comments')
        .expect(400)
        .then(({body}) => {

            expect(body).toMatchObject({
                msg : "400 - invalid type request"
            })
        })
    })


          

})


describe("Challenge 9 - DELETE /api/comments/:comment_id", () =>{

    test("responds with a 204 and no content after deleting the specified article", () => {


        return request(app)
        .delete('/api/comments/4')
        .expect(204)

    })


   
    test("responds with a 204 and checks the requested comments is deleted", () => {

        return request(app)
        .delete('/api/comments/4')
        .expect(204)
        .then(() => {

            return db.query(
                `SELECT * FROM comments;`
            ).then((body) => {
                return body.rows
            }).then((comments) => {
                comments.forEach(comment => {

                expect(comment.body).not.toEqual('body', " I carry a log — yes. Is it funny to you? It is not to me." )

                })
            })

        })


    })

    test('returns a 400 - when an invalid id type is sent', () => {

        return request(app)
        .delete('/api/comments/NotAnId')
        .expect(400)
        .then(({body}) => {

            expect(body).toMatchObject({
                msg : "400 - invalid type request"
            })
        })

    })


    test('returns a 404 - when an article_id type is given but does not exist', () => {

        return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({body}) => {


            expect(body).toMatchObject({
                msg : '404 - not found'
            })
        })
    })
    

})
