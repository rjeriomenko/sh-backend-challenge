const express = require('express');
const queuesRouter = express.Router();
const Queue = require('../queue');
const QUEUE = new Queue();

const createQueuesRouter = () => {
  // Optimize for "adding" and "removing" songs
  // Goals:
  // O(1) Append songs to an ordered queue
  // O(1) Remove songs from queue using indexes and song identifiers

  queuesRouter.get('/queues', (req, res) => {
    res.status(200).json(QUEUE.returnQueue());
  })
    
  queuesRouter.post('/queues', (req, res) => {
    const { songIds } = req.body;
    QUEUE.enqueueSongs(songIds);
    res.status(201).send();
  });
  
  queuesRouter.delete('/queues', (req, res) => {
    const { songIndexesAndIds } = req.body; 
    QUEUE.dequeueSongs(songIndexesAndIds);
    res.status(204).send();
  });

  return queuesRouter;
}

module.exports = {
  QUEUE,
  createQueuesRouter
};