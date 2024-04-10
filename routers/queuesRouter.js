// REST API Endpoints are here.
const express = require('express');
const { queue } = require('../dataStore');
const queuesRouter = express.Router();

const createQueuesRouter = () => {
  // Optimize for "adding" and "removing" songs
  // Goals:
  // O(1) Append individual songs to an ordered queue.
    // O (n) Addition of multiple songs at once, where n is the number of songs added.
  // O(1) Remove individual songs from queue using indexes and song identifiers.
    // O (n) Removal of multiple songs at once, where n is the number of songs removed.
  // O(n) Return representation of queue for client.

  queuesRouter.get('/queues', (req, res) => {
    res.status(200)
      .json({ nodeIndexesAndSongIds: queue.returnQueue()});
  })
    
  queuesRouter.post('/queues/add-song', (req, res) => {
    const { songIds } = req.body;
    queue.enqueueSongs(songIds);
    res.status(201)
      .send();
  });
  
  queuesRouter.delete('/queues/remove-song', (req, res) => {
    const { nodeIndexesAndSongIds } = req.body;
    queue.dequeueSongs(nodeIndexesAndSongIds);
    res.status(204)
      .send();
  });

  return queuesRouter;
}

module.exports = {
  createQueuesRouter
};