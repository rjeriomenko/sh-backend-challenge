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
      it("should append song to queue", async () => {
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
      it("should append song to queue", async () => {
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
      it("should append all songs to queue", async () => {
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
      it("should append all songs to queue", async () => {
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
      it("should append all songs to queue", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        QUEUE.setInitialQueue(initialQueue);
        const postPayload = { "songIds": ["songId3", "songId2", "songId2", "songId2"] };
        const expectedGetResponse = ["songId1", "songId2", "songId3", "songId3", "songId2", "songId2", "songId2"];

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
        const deletePayload = { "songIndexesAndIds": { 1: "songId2" }};
        const expectedGetResponse = ["songId1", "songId3"];

        const deleteResponse = await request(app).delete(APIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(APIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing one song from empty queue", () => {
      it("should return 204 status and make no changes", async () => {
        const deletePayload = { "songIndexesAndIds": { 0: "songId1" }};
        const expectedGetResponse = [];

        const deleteResponse = await request(app).delete(APIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(APIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing one song from queue that has multiples of that song", () => {
      it("should remove only one song from queue", async () => {
        const initialQueue = ["songId3", "songId2", "songId3", "songId3", "songId3", "songId4", "songId3"];
        QUEUE.setInitialQueue(initialQueue);
        const deletePayload = { "songIndexesAndIds": { 3: "songId3" }};
        const expectedGetResponse = ["songId3", "songId2", "songId3", "songId3", "songId4", "songId3"];

        const deleteResponse = await request(app).delete(APIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(APIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing multiple songs from pre-populated queue", () => {
      it("should remove multiple songs from queue and maintain order", async () => {
        const initialQueue = ["songId1", "songId2", "songId3", "songId4", "songId5", "songId6", "songId7"];
        QUEUE.setInitialQueue(initialQueue);
        const deletePayload = { "songIndexesAndIds": { 0: "songId1", 2: "songId3", 4: "songId5", 5: "songId6" }};
        const expectedGetResponse = ["songId2", "songId4", "songId7"];

        const deleteResponse = await request(app).delete(APIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(APIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing multiple songs from empty queue", () => {
      it("should return 204 status and make no changes", async () => {
        const deletePayload = { "songIndexesAndIds": { 0: "songId1", 2: "songId3", 4: "songId5", 5: "songId6" }};
        const expectedGetResponse = [];

        const deleteResponse = await request(app).delete(APIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(APIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing many songs from queue that has multiples of many songs", () => {
      it("should remove songs specified from queue and maintain order", async () => {
        const initialQueue = [
          "songId1", "songId2", "songId3", "songId4", "songId5",
          "songId1", "songId6", "songId7", "songId8", "songId9",
          "songId10", "songId11", "songId12", "songId13", "songId14",
          "songId2", "songId15", "songId16", "songId17", "songId18",
          "songId19", "songId3", "songId20", "songId21", "songId22"
        ];
        QUEUE.setInitialQueue(initialQueue);
        const deletePayload = {
          "songIndexesAndIds": {
            0: "songId1",
            17: "songId16",
            2: "songId3",
            10: "songId10",
            4: "songId5",
            5: "songId1",
            8: "songId8",
            20: "songId19",
            16: "songId15",
            12: "songId12",
            14: "songId14",
            6: "songId6",
            15: "songId2",
            23: "songId3"
          }
        };
        const expectedGetResponse = [
          "songId2","songId4", "songId7", "songId9",
          "songId11", "songId13", "songId17", "songId18",
          "songId3", "songId20", "songId21", "songId22"
        ];

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