// The Queue class encapsulates and manages the underlying LinkedList and Node classes.
// userId and queueId parameters are not used in this implementation, but 
// would be used in a database implementation.
const { LinkedList, Node } = require("./linkedList");

class Queue {
  linkedList;
  nodeIndexesAndNodes;
  
  constructor() {
    this.linkedList = new LinkedList();
    this.nodeIndexesAndNodes = {};
  }
  
  // O(1)
  // Append node with songId to end of queue, updating tail and head as needed.
  // Songs are identified by their songId.
  appendSong = (songId) => {
    const newNode = new Node(songId, this.linkedList.maxNodeIndex, this.linkedList.tail, null); 
    if (this.linkedList.tail) this.linkedList.tail.next = newNode;
    if (!this.linkedList.head) this.linkedList.head = newNode;
    this.linkedList.tail = newNode;
    
    this.nodeIndexesAndNodes[this.linkedList.maxNodeIndex] = newNode;
    this.linkedList.size++;
    this.linkedList.maxNodeIndex++;
  }

  // O(1)
  // Finds node that matches nodeIndex and nodeId, unlinks it from linked list,
  // and then removes associated entry from nodeIndexesAndNodes.
  removeSong = (nodeIndex, songId) => {
    // Check if song exists at the chosen index for idempotency.
    if (this.nodeIndexesAndNodes[nodeIndex]?.songId == songId) {
      const nodeToRemove = this.nodeIndexesAndNodes[nodeIndex];
      if (this.linkedList.tail == nodeToRemove) this.linkedList.tail = nodeToRemove.prev;
      if (this.linkedList.head == nodeToRemove) this.linkedList.head = nodeToRemove.next;
      if (nodeToRemove.prev) nodeToRemove.prev.next = nodeToRemove.next;
      if (nodeToRemove.next) nodeToRemove.next.prev = nodeToRemove.prev;

      delete this.nodeIndexesAndNodes[nodeIndex];
      this.linkedList.size--;
    }
  }

  // O(n) where n is number of songs to enqueue.
  // Accepts an array of songIds and passes them to appendSong.
  enqueueSongs = (songIds, userId, queueId) => {
    // songIds is always an array regardless of array length, which provides a
    // simple data structure for appending multiple songs.
    for (const songId of songIds) {
      this.appendSong(songId);
    }
  }

  // O(n) where n is number of songs to dequeue.
  // Accepts an object with { nodeIndex: songId } pairs and passes
  // the pairs to removeSong.
  // Pairs require both queueIndexes and songIds to ensure idempotency.
  // Will not remove more than one song with each nodeIndex/songId pair,
  // which demonstrates good idempotency.
  dequeueSongs = (nodeIndexesAndSongIds, userId, queueId) => {
    for (const [nodeIndex, songId] of Object.entries(nodeIndexesAndSongIds)) {
      this.removeSong(nodeIndex, songId);
    }
  }

  // O(n) where n is the size of the linked list.
  // Return all songs in queue as an array of [nodeIndex, songId] pairs.
  // The array maintains the order from front of queue to back of queue,
  // allowing the frontend to easily iterate through entries and maintain order.
  returnQueue = () => {
    const arrayOfNodeIndexesAndSongIds = [];
    
    let currentNode = this.linkedList.head;
    for (let i = 0; i < this.linkedList.size; i++) {
      arrayOfNodeIndexesAndSongIds.push([currentNode.nodeIndex, currentNode.songId]);
      currentNode = currentNode.next;
    }

    return arrayOfNodeIndexesAndSongIds;
  }
}

module.exports = {
  Queue
};