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
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({msg: '400 - invalid type request'});
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

describe("Challenge 17  /api/users/:username", () => {
  it("responds with a user object with the correct properties", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("username", "rogersop");
        expect(body).toHaveProperty("name", "paul");
        expect(body).toHaveProperty(
          "avatar_url",
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
        );
      });
  });

  it("return 404 user not found when an invalid user is provided", () => {
    return request(app)
      .get("/api/users/notauser")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "404 - not found",
        });
      });
  });

  it("return 404 user not found when an invalid type is provided", () => {
    return request(app)
      .get("/api/users/500")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "404 - not found",
        });
      });
  });
});

describe("Challenge 18 - PATCH /api/comments/:comment_id (vote)", () => {
  it("responds with the correct object when a positive increment is provided", () => {
    const update = { inc_votes: 1 };

    return request(app)
      .patch("/api/comments/3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("comment_id", 3);
        expect(body).toHaveProperty(
          "body",
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
        );
        expect(body).toHaveProperty("article_id", 1);
        expect(body).toHaveProperty("votes", 101);
        expect(body).toHaveProperty("created_at", "2020-03-01T01:13:00.000Z");
      });
  });

  it("responds with the correct object when a negative is provided", () => {
    const update = { inc_votes: -1 };

    return request(app)
      .patch("/api/comments/3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("comment_id", 3);
        expect(body).toHaveProperty(
          "body",
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
        );
        expect(body).toHaveProperty("article_id", 1);
        expect(body).toHaveProperty("votes", 99);
        expect(body).toHaveProperty("created_at", "2020-03-01T01:13:00.000Z");
      });
  });

  it("returns a 400 when the comment is invalid", () => {
    const update = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/invalidType")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "400 - invalid type request" });
      });
  });

  it("returns a 404 when valid type but resource does not exist", () => {
    const update = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/9999")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "404 - not found" });
      });
  });

  it("returns a 400 when request body violates the not null constraint", () => {
    const update = {};
    return request(app)
      .patch("/api/comments/3")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        
        expect(body).toEqual({ msg: "400 - not found" });
      });
  });

  it("returns a 400 when sent an invalid type on the request body", () => {
    const update = { inc_votes: "string" };
    return request(app)
      .patch("/api/comments/3")
      .send(update)
      .expect(400)
      .then(({ body }) => {
    
        expect(body).toEqual({ msg: "400 - invalid type request" });
      });
  });
});

describe("Challenge 19 - POST /api/articles", () => {
  it("respond with the correct 9 properties following accepting a body of 5 properties", () => {
    const article = {
      author: "rogersop",
      title: "why top boy is the best show on tv",
      body: "because its the best!!!!!",
      topic: "paper",
      article_img_url:
        "//www.google.com/url?sa=i&url=https%3A%2F%2Fwww.theguardian.com%2Ftv-and-radio%2F2019%2Faug%2F31%2Fronan-bennett-top-boy-series-three-interview-netflix-drake&psig",
    };

    return request(app)
      .post("/api/articles")
      .send(article)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("author", "rogersop");
        expect(body).toHaveProperty(
          "title",
          "why top boy is the best show on tv"
        );
        expect(body).toHaveProperty("body", "because its the best!!!!!");
        expect(body).toHaveProperty("topic", "paper");
        expect(body).toHaveProperty(
          "article_img_url",
          "//www.google.com/url?sa=i&url=https%3A%2F%2Fwww.theguardian.com%2Ftv-and-radio%2F2019%2Faug%2F31%2Fronan-bennett-top-boy-series-three-interview-netflix-drake&psig"
        );
        expect(typeof body.article_id).toBe("number");
        expect(body).toHaveProperty("votes", 0);
        expect(body.created_at.toString()).toHaveLength(24);
        expect(body).toHaveProperty("comment_count", 0);
      });
  });

  it("return the correct object with a default image url if one is not provided", () => {
    const article = {
      author: "rogersop",
      title: "why top boy is the best show on tv",
      body: "because its the best!!!!!",
      topic: "paper",
      article_img_url: null,
    };

    return request(app)
      .post("/api/articles")
      .send(article)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("author", "rogersop");
        expect(body).toHaveProperty(
          "title",
          "why top boy is the best show on tv"
        );
        expect(body).toHaveProperty("body", "because its the best!!!!!");
        expect(body).toHaveProperty("topic", "paper");
        expect(body).toHaveProperty(
          "article_img_url",
          "https://static.vecteezy.com/system/resources/thumbnails/002/206/011/small/article-icon-free-vector.jpg"
        );
        expect(typeof body.article_id).toBe("number");
        expect(body).toHaveProperty("votes", 0);
        expect(body.created_at.toString()).toHaveLength(24);
        expect(body).toHaveProperty("comment_count", 0);
      });
  });

  it("following the posting of an article, votes should be able to be applied", () => {
    const article = {
      author: "rogersop",
      title: "why top boy is the best show on tv",
      body: "because its the best!!!!!",
      topic: "paper",
      article_img_url: null,
    };

    return request(app)
      .post("/api/articles")
      .send(article)
      .expect(201)
      .then(({ body }) => {
        return request(app)
          .patch(`/api/articles/${body.article_id}`)
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
              expect(body.votes).toEqual(1);
          });
      });
  });

  it("400 - missing required fields", () => {
    const article = {};

    return request(app)
      .post("/api/articles")
      .send(article)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "400 - not found" });
      });
  });

  it("404 - sends back an error when invalid author is provided", () => {
    const article = {
      author: "bennyg",
      title: "why top boy is the best show on tv",
      body: "because its the best!!!!!",
      topic: "paper",
      article_img_url: null,
    };

    return request(app)
      .post("/api/articles")
      .send(article)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "404 - not found",
        });
      });
  });

  it("404 - sends back an error when invalid topic is provided", () => {
    const article = {
      author: "rogersop",
      title: "why top boy is the best show on tv",
      body: "because its the best!!!!!",
      topic: "wrongTopic",
      article_img_url: null,
    };

    return request(app)
      .post("/api/articles")
      .send(article)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "404 - not found",
        });
      });
  });
});

describe('challenge 20', () => {

    it('accepts queries - limit and p and responds with the correct articles and a total count property', () => {
        
    return request(app)
    .get('/api/articles?sort_by=article_id&order=asc&limit=5&p=2')
    .expect(200)
    .then(({body}) => {
        
        
        expect(body).toHaveProperty('total_count');
        expect(body.articles).toHaveLength(5);
        body.articles.forEach((article) => {

            expect(article).toHaveProperty('comment_count');
            expect(article).toHaveProperty('article_id');
            expect(article).toHaveProperty('author');
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('topic');
            expect(article).toHaveProperty('created_at');
            expect(article).toHaveProperty('votes');
            expect(article).toHaveProperty('article_img_url');

        })
        expect(body.articles[0].article_id).toBe(6);
        expect(body.articles[1].article_id).toBe(7);
        expect(body.articles[2].article_id).toBe(8);
        expect(body.articles[3].article_id).toBe(9);
        expect(body.articles[4].article_id).toBe(10);
        
    })

    });

    it('if limit is not applied, the default should be 10', () => {

     return request(app)
    .get('/api/articles?sort_by=article_id&order=asc&p=1')
    .expect(200)
    .then(({body}) => {
        
        expect(body.articles).toHaveLength(10);
    })
      
    });


    it('total Count should equal the total amount of articles with the filters applied - discounting the limit set.', () => {


    return request(app)
    .get('/api/articles?topic=mitch&sort_by=article_id&order=asc&limit=5&p=1')
    .expect(200)
    .then(({body}) => {

      expect(body).toHaveProperty('total_count', 12);
      expect(body.articles).toHaveLength(5);
      body.articles.forEach((article) => {
        expect(article).toHaveProperty('topic', 'mitch');
    })

    })

      
    });

    it('still return all the articles when the limit is higher than the amount of articles with filters applied', () => {

      return request(app)
    .get('/api/articles?topic=mitch&sort_by=article_id&order=asc&limit=40&p=1')
    .expect(200)
    .then(({body}) => {

      expect(body).toHaveProperty('total_count', 12);
      expect(body.articles).toHaveLength(12);
      body.articles.forEach((article) => {
        expect(article).toHaveProperty('topic', 'mitch');
    })

    })
      
    });

    it('200 - when limit is higher or equal to the total rows in the query but the page is higher than 1 returns an empty array, but with the total count', () => {

    return request(app)
    .get('/api/articles?topic=mitch&sort_by=article_id&order=asc&limit=40&p=2')
    .expect(200)
    .then(({body}) => {
      
      expect(body).toHaveProperty('total_count', 12)
      expect(body.articles).toEqual([]);

    })
      
    });


    it('400 - returns error when limit is invalid type', () => {
      
      return request(app)
        .get("/api/articles?topic=mitch&order=desc&limit=string&p=1")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: '400 - invalid type request' });
        });


    });

    it('400 - returns error when p is invalid type', () => {
      
      return request(app)
        .get("/api/articles?topic=mitch&order=desc&limit=5&p=string")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: '400 - invalid type request' });
        });


    });

    test("200 responds with empty Array - if invalid column passed into topic query - when limit and p included in the query", () => {
      return request(app)
        .get("/api/articles?topic=random&limit=10&p=1")
        .expect(200)
        .then(({ body }) => {
          
          expect(body.articles).toEqual([]);
        });
    });
  
    test("404 - if invalid column passed into sort_by query when limit and p included in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=pineapple&limit=10&p=1")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({msg: '400 - invalid type request'});
        });
    });
  
    test("404 - if invalid column passed into order query when limit and p included in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author&order=upsideDown&limit=10&p=1")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "404 - not found" });
        });
    });
  
    test("400 - if invalid key is passed in the query with topic when limit and p included in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch&RANDOMKEY=author&order=desc&limit=10&p=1")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "400 query does not exist" });
        });
    });
  
    test("400 - if invalid key is passed in the query without topic when limit and p included in the query", () => {
      return request(app)
        .get("/api/articles?RANDOMKEY=mitch&sort_by=author&order=desc&limit=10&p=1")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "400 query does not exist" });
        });
    });

});

describe('Challenge 21 - GET /api/articles/:article_id/comments (pagination)', () => {

    it('accepts limit and p as queries and responds with a correctly paginated object', () => {

      return request(app)
    .get('/api/articles/1/comments?limit=5&p=1')
    .expect(200)
    .then(({body}) => {
        
        expect(body.comments).toHaveLength(5);
        body.comments.forEach((comments) => {

            expect(comments).toHaveProperty('body');
            expect(comments).toHaveProperty('comment_id');
            expect(comments).toHaveProperty('author');
            expect(comments).toHaveProperty('article_id');
            expect(comments).toHaveProperty('created_at');
            expect(comments).toHaveProperty('votes');
        })

        const lastInSet = body.comments[4]
        return lastInSet
        
    }).then((data) => {

      return request(app)
      .get('/api/articles/1/comments?limit=5&p=2')
      .expect(200)
      .then(({body}) => {
    
        const dateFive = parseInt(data.created_at.slice(5,7))
        const dateSix = parseInt(body.comments[0].created_at.slice(5,7))
        expect(dateFive).toBeGreaterThan(dateSix)

      })

    })

      
    });

    it('if limit is absent but p is present limit will default to 10', () => {

      return request(app)
      .get('/api/articles/1/comments?&p=1')
      .expect(200)
      .then(({body}) => {

        expect(body.comments).toHaveLength(10);

      })
      
    });

    it('200 - when limit is higher or equal to the total rows in the query but the page is higher than 1 returns an empty array,', () => {

      return request(app)
      .get('/api/articles/1/comments?limit=40&p=2')
      .expect(200)
      .then(({body}) => {
        
        expect(body.comments).toEqual([]);
  
      })
        
      });

      it('400 - returns error when limit is invalid type', () => {
      
        return request(app)
          .get("/api/articles/1/comments?limit=string&p=1")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: '400 - invalid type request' });
          });
  
  
      });
  
      it('400 - returns error when p is invalid type', () => {
        
        return request(app)
          .get("/api/articles/1/comments?limit=5&p=string")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: '400 - invalid type request' });
          });

        })

        it('400 - rejects when an incorrect query is provided', () => {

          return request(app)
          .get("/api/articles/1/comments?limit=5&NOTAQUERY=1")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: '400 query does not exist' });
          });
          
        });
  
});

describe('POST /api/topics', () => {

  it('responds with a newly created topic object when requesting the creation of a new topic', () => {

    const newTopic = {
      slug: "TV",
      description: "whats on tv"
    }
    
    return request(app)
    .post('/api/topics')
    .send(newTopic)
    .expect(201)
    .then(({body}) => {

      expect(body).toHaveProperty('slug', 'TV');
      expect(body).toHaveProperty('description', 'whats on tv');

    })

  });

  it('400 - one of the keys is missing on the request', () => {
    
    const newTopic = {
      slug: "TV",
    }
    
    return request(app)
    .post('/api/topics')
    .send(newTopic)
    .expect(404)
    .then(({body}) => {
console.log(body);
      expect(body).toEqual({msg: '404 - not found'});

    })

  });

  it('400 - one of the keys is missing on the request', () => {
    
    const newTopic = {
      description: 'what on tv',
    }
    
    return request(app)
    .post('/api/topics')
    .send(newTopic)
    .expect(404)
    .then(({body}) => {
console.log(body);
      expect(body).toEqual({msg: '404 - not found'});

    })

  });
  
});

