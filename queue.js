// userId and queueId are not used in this implementation, but would be used in a database implementation
const LinkedList = require("./linkedList");

class Queue {
  #linkedList;
  
  constructor() {
    this.#linkedList = new LinkedList.LinkedList();
    this.nodeObj = {};
  }
  
  appendSong = (songId) => { // Refer to songs by songId because it is problematic to use song names
    const newNode = new LinkedList.Node(songId, this.#linkedList.tail, null); // Make next Node explicitly null for defensive programming
    if (this.#linkedList.tail) this.#linkedList.tail.next = newNode;
    this.#linkedList.tail = newNode;
    
    this.nodeObj[this.#linkedList.length] = newNode;
    this.#linkedList.length++;
  }

  removeSong = (queueIndex, songId) => {
    // Check if song exists at the chosen index
    if (this.#linkedList[queueIndex]?.songId == songId) {
      const nodeToRemove = this.#linkedList[queueIndex];
      if (this.#linkedList.tail == nodeToRemove) { this.#linkedList.tail = nodeToRemove.prev };
      if (nodeToRemove.prev) nodeToRemove.prev.next = nodeToRemove.next;
      if (nodeToRemove.next) nodeToRemove.next.prev = nodeToRemove.prev;

      delete this.nodeObj[queueIndex];
      this.#linkedList.length--;
    }
  }

  enqueueSongs = (songIds, userId, queueId) => { // Making songIds an array future-proofs it
    for (const songId of songIds) {
      this.appendSong(songId);
    }
  }

  // Require both queueIndexes and songIds to ensure idempotency
  // Will remove identical songs in positions 3,4,5 (idempotency failure) but not 3, 5, 7
  dequeueSongs = (songIds, queueIndexes, userId, queueId) => {
    for (const queueIndex of queueIndexes) {
      this.removeSong(queueIndex, songIds[queueIndex]);
    }

    // failure route ?
    // idempotency route ?
    // success route ?
  }

  returnQueue = () => {
    const queueArray = [];
    for (let i = 0; i < this.#linkedList.length; i++) {
      queueArray.push(this.nodeObj[i].songId);
    }
    return queueArray;
  }
}

module.exports = Queue;