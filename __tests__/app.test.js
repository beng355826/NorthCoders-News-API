


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
=======
describe("Challenge 7 - POST /api/articles/:article_id/comments", () => {

    test("status 201 - should respond with the posted comment when the correct properties are provided", () => {

        const comment = {
            username: "butter_bridge",
            body: "Ey up lad fancy a jar?"
        }

        return request(app)
        .post('/api/articles/3/comments')
        .send(comment)
        .expect(201)
        .then(({body}) => {
        
        expect(body.comment).toHaveProperty('comment_id', 19)
        expect(body.comment).toHaveProperty('body', 'Ey up lad fancy a jar?')
        expect(body.comment).toHaveProperty('article_id', 3)
        expect(body.comment).toHaveProperty('author', 'butter_bridge' )
        expect(body.comment).toHaveProperty('votes', 0)
        expect(body.comment).toHaveProperty('created_at', expect.any(String))

        }) 
    })

    test("status 201 - should ignore unnecessary properties in the request body and respond with the posted comment with the correct properties", () => {

        const comment = {
            username: "butter_bridge",
            body: "Ey up lad fancy a jar?",
            ignorableProperty: "should ignore as its not a valid column in the table"
        }

        return request(app)
        .post('/api/articles/3/comments')
        .send(comment)
        .expect(201)
        .then(({body}) => {
        
        expect(body.comment).toHaveProperty('comment_id', 19)
        expect(body.comment).toHaveProperty('body', 'Ey up lad fancy a jar?')
        expect(body.comment).toHaveProperty('article_id', 3)
        expect(body.comment).toHaveProperty('author', 'butter_bridge' )
        expect(body.comment).toHaveProperty('votes', 0)
        expect(body.comment).toHaveProperty('created_at', expect.any(String))

        }) 
    })
    




    test("sends a 400 when an invalid type request is sent" , () => {

        const comment = {
            username: "butter_bridge",
            body: "Ey up lad fancy a jar?"
        }

        return request(app)
        .post('/api/articles/notAnId/comments')
        .send(comment)
        .expect(400)
        .then(({body}) => {

        expect(body).toMatchObject({
            msg:'400 - invalid type request'
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

    test("sends a 400 an incomplete comment is sent" , () => {

        const comment = {
            
            username: "butter_bridge",
        }

        return request(app)
        .post('/api/articles/9000/comments')
        .send(comment)
        .expect(400)
        .then(({body}) => {

        expect(body).toMatchObject({
            msg:'400 - not found'
        })
        })

    })
    
    test("sends a 404 when an invalid article_id number is sent" , () => {

        const comment = {
            username: "butter_bridge",
            body: "Ey up lad fancy a jar?"
        }

        return request(app)
        .post('/api/articles/9000/comments')
        .send(comment)
        .expect(404)
        .then(({body}) => {

        expect(body).toMatchObject({
            msg:'404 - not found'
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

    test("sends a 404 when a username does not exist" , () => {

        const comment = {
            username: "BennyG",
            body: "Ey up lad fancy a jar?"
        }

        return request(app)
        .post('/api/articles/9000/comments')
        .send(comment)
        .expect(404)
        .then(({body}) => {

        expect(body).toMatchObject({
            msg:'404 - not found'
        })

        })

    })

})


describe("Challenge 8 - PATCH /api/articles/:article_id ", () => {
    test("responds with correct article with an updated vote property when the increment is positive", () => {

        const update = { inc_votes: 1 }

        return request(app)
        .patch('/api/articles/3')
        .send(update)
        .expect(200)
        .then((article) => {

            expect(article._body).toHaveProperty('article_id', 3 )
            expect(article._body).toHaveProperty('title', expect.any(String))
            expect(article._body).toHaveProperty('topic', expect.any(String))
            expect(article._body).toHaveProperty('author', expect.any(String))
            expect(article._body).toHaveProperty('body', expect.any(String))
            expect(article._body).toHaveProperty('created_at', expect.any(String))
            expect(article._body).toHaveProperty('votes', 1)
            expect(article._body).toHaveProperty('article_img_url', expect.any(String))
        })

    })


    test("responds with correct article with an updated vote property when the increment is negative", () => {

        const update = { inc_votes: -10 }

        return request(app)
        .patch('/api/articles/3')
        .send(update)
        .expect(200)
        .then((article) => {

            expect(article._body).toHaveProperty('article_id', 3 )
            expect(article._body).toHaveProperty('title', expect.any(String))
            expect(article._body).toHaveProperty('topic', expect.any(String))
            expect(article._body).toHaveProperty('author', expect.any(String))
            expect(article._body).toHaveProperty('body', expect.any(String))
            expect(article._body).toHaveProperty('created_at', expect.any(String))
            expect(article._body).toHaveProperty('votes', -10)
            expect(article._body).toHaveProperty('article_img_url', expect.any(String))
        })

    })

    test("responds with correct article with an updated vote property and ignores any invalid properties on the request body", () => {

        const update = { inc_votes: -10,
                         ignorableProperty : 'please ignore me'}

        return request(app)
        .patch('/api/articles/3')
        .send(update)
        .expect(200)
        .then((article) => {

            expect(article._body).toHaveProperty('article_id', 3 )
            expect(article._body).toHaveProperty('title', expect.any(String))
            expect(article._body).toHaveProperty('topic', expect.any(String))
            expect(article._body).toHaveProperty('author', expect.any(String))
            expect(article._body).toHaveProperty('body', expect.any(String))
            expect(article._body).toHaveProperty('created_at', expect.any(String))
            expect(article._body).toHaveProperty('votes', -10)
            expect(article._body).toHaveProperty('article_img_url', expect.any(String))
        })

    })


    test("returns a 400 when the endpoint is provided with an invalid article_id (not a number)", () => {
        
        const update = { inc_votes: -10 }

        return request(app)
        .patch('/api/articles/notAnId')
        .send(update)
        .expect(400)
        .then((article) => {

        expect(article._body).toMatchObject(
            {msg:'400 - invalid type request'}
            )

        })
    })

    test("returns a 404 when sent an article ID (correct type) but the resource does not exist", () => {
        
        const update = { inc_votes: -10 }

        return request(app)
        .patch('/api/articles/9999')
        .send(update)
        .expect(404)
        .then((article) => {

        expect(article._body).toMatchObject(
            {msg:'404 - not found'})

        })
    })


    test("returns a 400 when sent a request body that violates the not null constraint", () => {
        
        const update = {}

        return request(app)
        .patch('/api/articles/3')
        .send(update)
        .expect(400)
        .then((article) => {

        expect(article._body).toMatchObject(
            {msg:'400 - not found'})

        })
    })

    test("returns a 400 when sent an invalid type on the request body", () => {
        
        const update = {inc_votes: "a String"}

        return request(app)
        .patch('/api/articles/3')
        .send(update)
        .expect(400)
        .then((article) => {

        expect(article._body).toMatchObject(
            {msg:'400 - invalid type request'})

        })
    })


})


