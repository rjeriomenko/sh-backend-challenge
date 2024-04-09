const request = require('supertest');
const createServer = require('../utils/server');
const app = createServer();
const queuesRouter = require('../utils/queuesRouter');
const QUEUE = queuesRouter.QUEUE;
const APIURL = '/api/v1/queues';

describe("queue", () => {
  beforeEach(() => {
    QUEUE.resetQueue();
  });
  describe("get queue route", () => {
    describe("given there are no songs in the queue", () => {
      it("should return an empty array", async () => {
        const { body, statusCode } = await request(app).get(APIURL);

        expect(statusCode).toBe(200);
        expect(body).toEqual([]);
      });
    });

    describe("given there are songs in the queue", () => {
      it("should return an array of songs", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        QUEUE.setInitialQueue(initialQueue);

        const { body, statusCode } = await request(app).get(APIURL);

        expect(statusCode).toBe(200);
        expect(body).toEqual(initialQueue);
      });
    });
  });

  describe("post queue route", () => {
    describe("given client is adding one song to empty queue", () => {
      it("should add song to queue", async () => {
        const postPayload = { "songIds": ["songId1"] };
        const expectedGetResponse = ["songId1"];

        const postResponse = await request(app).post(APIURL)
          .send(postPayload);
        const getResponse = await request(app).get(APIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is adding one song to pre-populated queue", () => {
      it("should add song to queue", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        QUEUE.setInitialQueue(initialQueue);
        const postPayload = { "songIds": ["songId4"] };
        const expectedGetResponse = ["songId1", "songId2", "songId3", "songId4"];

        const postResponse = await request(app).post(APIURL)
          .send(postPayload);
        const getResponse = await request(app).get(APIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is adding multiple songs to empty queue", () => {
      it("should add all songs to queue", async () => {
        const postPayload = { "songIds": ["songId4", "songId5", "songId6"] };
        const expectedGetResponse = ["songId4", "songId5", "songId6"];

        const postResponse = await request(app).post(APIURL)
          .send(postPayload);
        const getResponse = await request(app).get(APIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is adding multiple songs to pre-populated queue", () => {
      it("should add all songs to queue", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        QUEUE.setInitialQueue(initialQueue);
        const postPayload = { "songIds": ["songId4", "songId5", "songId6"] };
        const expectedGetResponse = ["songId1", "songId2", "songId3", "songId4", "songId5", "songId6"];

        const postResponse = await request(app).post(APIURL)
          .send(postPayload);
        const getResponse = await request(app).get(APIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is adding multiples of the same song to a pre-populated queue", () => {
      it("should add all songs to queue", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        QUEUE.setInitialQueue(initialQueue);
        const postPayload = { "songIds": ["songId3", "songId1", "songId2"] };
        const expectedGetResponse = ["songId1", "songId2", "songId3", "songId3", "songId1", "songId2"];

        const postResponse = await request(app).post(APIURL)
          .send(postPayload);
        const getResponse = await request(app).get(APIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });
  });

  describe("delete queue route", () => {
    describe("given client is removing one song from pre-populated queue", () => {
      it("should remove song from queue", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        QUEUE.setInitialQueue(initialQueue);
        const deletePayload = { "songIndexesAndIds": { "1": "songId2" }};
        const expectedGetResponse = ["songId1", "songId3"];

        const deleteResponse = await request(app).delete(APIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(APIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });
  });
});