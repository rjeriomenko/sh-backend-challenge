// Tests are run with "npm test"

const request = require('supertest');
const { LinkedList } = require("../linkedList");
const { createApp } = require('../app');
const { queue } = require('../dataStore');
const app = createApp();
const GETAPIURL = '/api/v1/queues';
const POSTAPIURL = '/api/v1/queues/add-song';
const DELETEAPIURL = '/api/v1/queues/remove-song';


// Used to clear queue before every test
clearQueue = () => {
  queue.linkedList = new LinkedList();
  queue.nodeIndexesAndNodes = {};
}

// queue.enqueueSongs is used to set the initial queue state before 
// some tests are run.
describe("queue", () => {
  beforeEach(() => {
    clearQueue();
  });
  describe("get queue route", () => {
    describe("given there are no songs in the queue", () => {
      it("should return an empty array", async () => {
        const { body, statusCode } = await request(app).get(GETAPIURL);

        expect(statusCode).toBe(200);
        expect(body).toEqual({ "nodeIndexesAndSongIds": [] });
      });
    });

    describe("given there are songs in the queue", () => {
      it("should return an array of songs", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        const expectedGetResponse = { "nodeIndexesAndSongIds": 
          [[0, "songId1"], 
          [1, "songId2"], 
          [2, "songId3"]]
        };
        queue.enqueueSongs(initialQueue);

        const { body, statusCode } = await request(app).get(GETAPIURL);

        expect(statusCode).toBe(200);
        expect(body).toEqual(expectedGetResponse);
      });
    });
  });

  describe("post queue route", () => {
    describe("given client is adding one song to empty queue", () => {
      it("should append song to queue", async () => {
        const postPayload = { "songIds": ["songId1"] };
        const expectedGetResponse = { "nodeIndexesAndSongIds": [[0, "songId1"]] };

        const postResponse = await request(app).post(POSTAPIURL)
          .send(postPayload);
        const getResponse = await request(app).get(GETAPIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is adding one song to pre-populated queue", () => {
      it("should append song to queue", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        queue.enqueueSongs(initialQueue);
        const postPayload = { "songIds": ["songId4"] };
        const expectedGetResponse = { "nodeIndexesAndSongIds":
          [[0, "songId1"], 
          [1, "songId2"], 
          [2, "songId3"], 
          [3, "songId4"]]
        };

        const postResponse = await request(app).post(POSTAPIURL)
          .send(postPayload);
        const getResponse = await request(app).get(GETAPIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is adding multiple songs to empty queue", () => {
      it("should append all songs to queue", async () => {
        const postPayload = { "songIds": ["songId4", "songId5", "songId6"] };
        const expectedGetResponse = { "nodeIndexesAndSongIds": 
          [[0, "songId4"],
          [1, "songId5"],
          [2, "songId6"]]
        };

        const postResponse = await request(app).post(POSTAPIURL)
          .send(postPayload);
        const getResponse = await request(app).get(GETAPIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is adding multiple songs to pre-populated queue", () => {
      it("should append all songs to queue", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        queue.enqueueSongs(initialQueue);
        const postPayload = { "songIds": ["songId4", "songId5", "songId6"] };
        const expectedGetResponse = { "nodeIndexesAndSongIds":
          [[0, "songId1"],
          [1, "songId2"],
          [2, "songId3"],
          [3, "songId4"],
          [4, "songId5"],
          [5, "songId6"]] 
        };

        const postResponse = await request(app).post(POSTAPIURL)
          .send(postPayload);
        const getResponse = await request(app).get(GETAPIURL);
        
        expect(postResponse.status).toBe(201);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is adding multiples of the same song to a pre-populated queue", () => {
      it("should append all songs to queue", async () => {
        const initialQueue = ["songId1", "songId2", "songId3"];
        queue.enqueueSongs(initialQueue);
        const postPayload = { "songIds": ["songId3", "songId2", "songId2", "songId2"] };
        const expectedGetResponse = { "nodeIndexesAndSongIds": 
          [[0, "songId1"],
          [1, "songId2"],
          [2, "songId3"],
          [3, "songId3"],
          [4, "songId2"],
          [5, "songId2"],
          [6, "songId2"]]
        };

        const postResponse = await request(app).post(POSTAPIURL)
          .send(postPayload);
        const getResponse = await request(app).get(GETAPIURL);
        
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
        queue.enqueueSongs(initialQueue);
        const deletePayload = { "nodeIndexesAndSongIds": { 1: "songId2" }};
        const expectedGetResponse = { "nodeIndexesAndSongIds":
          [[0, "songId1"],
          [2, "songId3"]]
        };

        const deleteResponse = await request(app).delete(DELETEAPIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(GETAPIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing one song from empty queue", () => {
      it("should return 204 status and make no changes", async () => {
        const deletePayload = { "nodeIndexesAndSongIds": { 0: "songId1" }};
        const expectedGetResponse = { "nodeIndexesAndSongIds": [] };

        const deleteResponse = await request(app).delete(DELETEAPIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(GETAPIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing one song from queue that has multiples of that song", () => {
      it("should remove only one song from queue", async () => {
        const initialQueue = ["songId3", "songId2", "songId3", "songId3", "songId3", "songId4", "songId3"];
        queue.enqueueSongs(initialQueue);
        const deletePayload = { "nodeIndexesAndSongIds": { 3: "songId3" }};
        const expectedGetResponse = { "nodeIndexesAndSongIds": 
          [[0, "songId3"],
          [1, "songId2"],
          [2, "songId3"],
          [4, "songId3"],
          [5, "songId4"],
          [6, "songId3"]]
        };

        const deleteResponse = await request(app).delete(DELETEAPIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(GETAPIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing multiple songs from pre-populated queue", () => {
      it("should remove multiple songs from queue and maintain order", async () => {
        const initialQueue = ["songId1", "songId2", "songId3", "songId4", "songId5", "songId6", "songId7"];
        queue.enqueueSongs(initialQueue);
        const deletePayload = { "nodeIndexesAndSongIds": { 0: "songId1", 2: "songId3", 4: "songId5", 5: "songId6" }};
        const expectedGetResponse = { "nodeIndexesAndSongIds": 
          [[1, "songId2"], 
          [3, "songId4"], 
          [6, "songId7"]]
        };

        const deleteResponse = await request(app).delete(DELETEAPIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(GETAPIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });

    describe("given client is removing multiple songs from empty queue", () => {
      it("should return 204 status and make no changes", async () => {
        const deletePayload = { "nodeIndexesAndSongIds": { 0: "songId1", 2: "songId3", 4: "songId5", 5: "songId6" }};
        const expectedGetResponse = { "nodeIndexesAndSongIds": [] };

        const deleteResponse = await request(app).delete(DELETEAPIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(GETAPIURL);

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
        queue.enqueueSongs(initialQueue);
        const deletePayload = {
          "nodeIndexesAndSongIds": {
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
        const expectedGetResponse =  { "nodeIndexesAndSongIds": 
          [[1, "songId2"], 
          [3, "songId4"], 
          [7, "songId7"], 
          [9, "songId9"], 
          [11, "songId11"], 
          [13, "songId13"], 
          [18, "songId17"], 
          [19, "songId18"], 
          [21, "songId3"], 
          [22, "songId20"],
          [23, "songId21"], 
          [24, "songId22"]]
        }

        const deleteResponse = await request(app).delete(DELETEAPIURL)
          .send(deletePayload);
        const getResponse = await request(app).get(GETAPIURL);

        expect(deleteResponse.status).toBe(204);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expectedGetResponse);
      });
    });
  });
});