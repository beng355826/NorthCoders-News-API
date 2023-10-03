const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe(" Challenge 2 - GET /api/topics", () => {
  test("responds with a 200 status code when request is successful", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("responds with all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.AllTopics).toHaveLength(3);

        body.AllTopics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("Error message 404 sent when incorrect api request is sent when parametric input is not required ", () => {
  test("responds with an error 404 when the Get request can not be found", () => {
    return request(app).get("/api/topic").expect(404);
  });
});

describe(" Challenge 3 - GET /api/", () => {
  test("Should respond with a description of all available endpoints correctly formatted", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((body) => {
        for (const key in body._body) {
          expect(body._body[key]).toHaveProperty(
            "description",
            expect.any(String)
          );
          expect(body._body[key]).toHaveProperty("queries", expect.any(Array));
          expect(body._body[key]).toHaveProperty("format", expect.any(String));
          expect(body._body[key]).toHaveProperty(
            "exampleResponse",
            expect.any(Object)
          );
        }
      });
  });
});

describe(" Challenge 4 - GET /api/articles/:article_id", () => {
  test("responds with the correct row corresponding to the correct article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((body) => {
        expect(body._body).toHaveProperty("article_id", 1);
        expect(body._body).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(body._body).toHaveProperty("topic", "mitch");
        expect(body._body).toHaveProperty("author", "butter_bridge");
        expect(body._body).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(body._body).toHaveProperty(
          "created_at",
          "2020-07-09T20:11:00.000Z"
        );
        expect(body._body).toHaveProperty("votes", 100);
        expect(body._body).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("responds with the correct error message when sent an invalid type (not a number)", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then((body) => {
        expect(body._body).toMatchObject({
          msg: "400 - invalid type request",
        });
      });
  });

  test("responds with the correct error message when sent a correct type but invalid", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((body) => {
        expect(body._body).toMatchObject({
          msg: "404 - not found",
        });
      });
  });
});

describe(" Challenge 5 - GET /api/articles", () => {
  test("Check the request returns a 200 and has the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("Check the request returns in date descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("Challenge 6 - GET /api/articles/:article_id/comments", () => {
  test("responds with an array of comments with the correct properties", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(2);

        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", 3);
        });
      });
  });

  test("Comments should be served with the most recent comments first.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("returns a 200, when valid ID exists but no comments.", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({ comments: [] });
      });
  });

  test("returns a 404 - when an incorrect article_id is given", () => {
    return request(app)
      .get("/api/articles/2000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "404 - not found",
        });
      });
  });

  test("returns a 400 - when an invalid type is sent in the GET request", () => {
    return request(app)
      .get("/api/articles/NotAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "400 - invalid type request",
        });
      });
  });
});

describe("Challenge 7 - POST /api/articles/:article_id/comments", () => {
  test("status 201 - should respond with the posted comment when the correct properties are provided", () => {
    const comment = {
      username: "butter_bridge",
      body: "Ey up lad fancy a jar?",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id", 19);
        expect(body.comment).toHaveProperty("body", "Ey up lad fancy a jar?");
        expect(body.comment).toHaveProperty("article_id", 3);
        expect(body.comment).toHaveProperty("author", "butter_bridge");
        expect(body.comment).toHaveProperty("votes", 0);
        expect(body.comment).toHaveProperty("created_at", expect.any(String));
      });
  });

  test("status 201 - should ignore unnecessary properties in the request body and respond with the posted comment with the correct properties", () => {
    const comment = {
      username: "butter_bridge",
      body: "Ey up lad fancy a jar?",
      ignorableProperty: "should ignore as its not a valid column in the table",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id", 19);
        expect(body.comment).toHaveProperty("body", "Ey up lad fancy a jar?");
        expect(body.comment).toHaveProperty("article_id", 3);
        expect(body.comment).toHaveProperty("author", "butter_bridge");
        expect(body.comment).toHaveProperty("votes", 0);
        expect(body.comment).toHaveProperty("created_at", expect.any(String));
      });
  });

  test("sends a 400 when an invalid type request is sent", () => {
    const comment = {
      username: "butter_bridge",
      body: "Ey up lad fancy a jar?",
    };

    return request(app)
      .post("/api/articles/notAnId/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "400 - invalid type request",
        });
      });
  });

  test("sends a 400 an incomplete comment is sent", () => {
    const comment = {
      username: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/9000/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "400 - not found",
        });
      });
  });

  test("sends a 404 when an invalid article_id number is sent", () => {
    const comment = {
      username: "butter_bridge",
      body: "Ey up lad fancy a jar?",
    };

    return request(app)
      .post("/api/articles/9000/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "404 - not found",
        });
      });
  });

  test("sends a 404 when a username does not exist", () => {
    const comment = {
      username: "BennyG",
      body: "Ey up lad fancy a jar?",
    };

    return request(app)
      .post("/api/articles/9000/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "404 - not found",
        });
      });
  });
});

describe("Challenge 8 - PATCH /api/articles/:article_id ", () => {
  test("responds with correct article with an updated vote property when the increment is positive", () => {
    const update = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(200)
      .then((article) => {
        expect(article._body).toHaveProperty("article_id", 3);
        expect(article._body).toHaveProperty("title", expect.any(String));
        expect(article._body).toHaveProperty("topic", expect.any(String));
        expect(article._body).toHaveProperty("author", expect.any(String));
        expect(article._body).toHaveProperty("body", expect.any(String));
        expect(article._body).toHaveProperty("created_at", expect.any(String));
        expect(article._body).toHaveProperty("votes", 1);
        expect(article._body).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });

  test("responds with correct article with an updated vote property when the increment is negative", () => {
    const update = { inc_votes: -10 };

    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(200)
      .then((article) => {
        expect(article._body).toHaveProperty("article_id", 3);
        expect(article._body).toHaveProperty("title", expect.any(String));
        expect(article._body).toHaveProperty("topic", expect.any(String));
        expect(article._body).toHaveProperty("author", expect.any(String));
        expect(article._body).toHaveProperty("body", expect.any(String));
        expect(article._body).toHaveProperty("created_at", expect.any(String));
        expect(article._body).toHaveProperty("votes", -10);
        expect(article._body).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });

  test("responds with correct article with an updated vote property and ignores any invalid properties on the request body", () => {
    const update = { inc_votes: -10, ignorableProperty: "please ignore me" };

    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(200)
      .then((article) => {
        expect(article._body).toHaveProperty("article_id", 3);
        expect(article._body).toHaveProperty("title", expect.any(String));
        expect(article._body).toHaveProperty("topic", expect.any(String));
        expect(article._body).toHaveProperty("author", expect.any(String));
        expect(article._body).toHaveProperty("body", expect.any(String));
        expect(article._body).toHaveProperty("created_at", expect.any(String));
        expect(article._body).toHaveProperty("votes", -10);
        expect(article._body).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });

  test("returns a 400 when the endpoint is provided with an invalid article_id (not a number)", () => {
    const update = { inc_votes: -10 };

    return request(app)
      .patch("/api/articles/notAnId")
      .send(update)
      .expect(400)
      .then((article) => {
        expect(article._body).toMatchObject({
          msg: "400 - invalid type request",
        });
      });
  });

  test("returns a 404 when sent an article ID (correct type) but the resource does not exist", () => {
    const update = { inc_votes: -10 };

    return request(app)
      .patch("/api/articles/9999")
      .send(update)
      .expect(404)
      .then((article) => {
        expect(article._body).toMatchObject({ msg: "404 - not found" });
      });
  });

  test("returns a 400 when sent a request body that violates the not null constraint", () => {
    const update = {};

    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(400)
      .then((article) => {
        expect(article._body).toMatchObject({ msg: "400 - not found" });
      });
  });

  test("returns a 400 when sent an invalid type on the request body", () => {
    const update = { inc_votes: "a String" };

    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(400)
      .then((article) => {
        expect(article._body).toMatchObject({
          msg: "400 - invalid type request",
        });
      });
  });
});

describe("Challenge 9 - DELETE /api/comments/:comment_id", () => {
  test("responds with a 204 and no content after deleting the specified article", () => {
    return request(app).delete("/api/comments/4").expect(204);
  });

  test("responds with a 204 and checks the requested comments is deleted", () => {
    return request(app)
      .delete("/api/comments/4")
      .expect(204)
      .then(() => {
        return db
          .query(`SELECT * FROM comments;`)
          .then((body) => {
            return body.rows;
          })
          .then((comments) => {
            comments.forEach((comment) => {
              expect(comment.body).not.toEqual(
                "body",
                " I carry a log — yes. Is it funny to you? It is not to me."
              );
            });
          });
      });
  });

  test("returns a 400 - when an invalid id type is sent", () => {
    return request(app)
      .delete("/api/comments/NotAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "400 - invalid type request",
        });
      });
  });

  test("returns a 404 - when an article_id type is given but does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "404 - not found",
        });
      });
  });
});

describe("Challenge 10 - GET /api/users", () => {
  test("responds with 200 and an array of objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);

        body.users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("Challenge 11 - /api/articles (queries)", () => {
  test("responds with 200 and shows the articles with the specified query value and that they are correctly formatted", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        //console.log(body.articles)
        expect(body.articles).toHaveLength(12);

        body.articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("200 articles filtered by topic with articles sorted by the value specified in the default descending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);

        body.articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });

  test("200 - articles filtered by topic with articles sorted by the value specified in ascending", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        expect(body.articles[0].author).toBe("butter_bridge");
        expect(body.articles[11].author).toBe("rogersop");
      });
  });

  test("200 responds with ALL articles authors sorted in alphabetical order with descending as a default", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        expect(body.articles[0].author).toBe("rogersop");
        expect(body.articles[12].author).toBe("butter_bridge");
      });
  });

  test("200 responds with ALL articles authors sorted in alphabetical order in ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        expect(body.articles[0].author).toBe("butter_bridge");
        expect(body.articles[12].author).toBe("rogersop");
      });
  });

  test("200 responds with empty Array - if invalid column passed into topic query", () => {
    return request(app)
      .get("/api/articles?topic=random")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });

  test("404 - if invalid column passed into sort_by query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=pineapple")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "404 - column does not exist" });
      });
  });

  test("404 - if invalid column passed into order query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=upsideDown")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "404 - not found" });
      });
  });

  test("400 - if invalid key is passed in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&RANDOMKEY=author&order=desc")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "400 query does not exist" });
      });
  });

  test("400 - if invalid key is passed in the query", () => {
    return request(app)
      .get("/api/articles?RANDOMKEY=mitch&sort_by=author&order=desc")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "400 query does not exist" });
      });
  });
});

describe("Challenge 12 - GET /api/articles/:article_id (comment_count)", () => {
  test("respond with an article Object with a comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((body) => {
        expect(body._body).toHaveProperty("article_id", 1);
        expect(body._body).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(body._body).toHaveProperty("topic", "mitch");
        expect(body._body).toHaveProperty("author", "butter_bridge");
        expect(body._body).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(body._body).toHaveProperty(
          "created_at",
          "2020-07-09T20:11:00.000Z"
        );
        expect(body._body).toHaveProperty("votes", 100);
        expect(body._body).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(body._body).toHaveProperty("comment_count", 11);
      });
  });
});

describe('Challenge 16 ', () => {
    

    it('', () => {
        
    });

});


