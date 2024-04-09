// userId and queueId are not used in this implementation, but would be used in a database implementation
const LinkedList = require("./linkedList");

class Queue {
  #linkedList;
  #nodeIndex;
  #sortedIndex;
  
  constructor() {
    this.#linkedList = new LinkedList.LinkedList();
    this.#nodeIndex = {};
    this.#sortedIndex = true;
  }

  // Used to set initial queue for testing
  setInitialQueue = (initialQueue) => {
    for (const songId of initialQueue) {
      // Make newNode.next explicitly null for defensive programming
      const newNode = new LinkedList.Node(songId, this.#linkedList.tail, null);
      if (this.#linkedList.tail) this.#linkedList.tail.next = newNode;
      this.#linkedList.tail = newNode;
      this.#nodeIndex[this.#linkedList.maxIndex] = newNode;
      this.#linkedList.size++;
      this.#linkedList.maxIndex++;
    }
  }
  
  // Refer to songs by songId because it is problematic to use song names
  appendSong = (songId) => {
    const newNode = new LinkedList.Node(songId, this.#linkedList.tail, null); 
    if (this.#linkedList.tail) this.#linkedList.tail.next = newNode;
    this.#linkedList.tail = newNode;
    
    this.#nodeIndex[this.#linkedList.maxIndex] = newNode;
    this.#linkedList.size++;
    this.#linkedList.maxIndex++;
  }

  // Remove index key from nodeIndex and unlink associated node from linked list
  removeSong = (songIndex, songId) => {
    // Check if song exists at the chosen index for idempotency
    if (this.#nodeIndex.songIndex == songId) {
      const nodeToRemove = this.#nodeIndex[songIndex];
      if (nodeToRemove.prev) nodeToRemove.prev.next = nodeToRemove.next;
      if (nodeToRemove.next) nodeToRemove.next.prev = nodeToRemove.prev;

      delete this.#nodeIndex[songIndex];
      this.#linkedList.size--;
      this.#sortedIndex = false;
    }
  }

  enqueueSongs = (songIds, userId, queueId) => {
    // songIds is always an array, regardless of array length
    // Provides simple, consistent parameter for appending songs
    for (const songId of songIds) {
      this.appendSong(songId);
    }
  }

  // Require both queueIndexes and songIds to ensure idempotency
  // Will remove identical songs in positions 3, 4, 5 (idempotency failure) but not 3, 5, 7
  dequeueSongs = (songIndexesAndIds, userId, queueId) => {
    for (const [songIndex, songId] of Object.entries(songIndexesAndIds)) {
      this.removeSong(songIndex, songId);
    }

    // This line may or may not be needed, depending on the client-side playlist data structure
    // This could be called elsewhere later, allowing immediate O(1) song removal from the linked list
    if(this.#linkedList.size) this.sortLinkedList();

    // failure route ?
    // idempotency route ?
    // success route ?
  }

  // Resets order of the linked list index 
  sortLinkedList = () => {
    if (!this.#sortedIndex) {
      let currentNode = this.#linkedList.tail;
      for (let i = this.#linkedList.size; i > 0; i--) {
        this.#nodeIndex[i - 1] = currentNode;
        currentNode = currentNode.prev;
      }
    }
  }

  // Return all songs in queue as array
  returnQueue = () => {
    const songIdArray = [];
    for (let i = 0; i < this.#linkedList.size; i++) {
      songIdArray.push(this.#nodeIndex[i].songId);
    }
    return songIdArray;
  }

  resetQueue = () => {
    this.#linkedList = new LinkedList.LinkedList();
    this.#nodeIndex = {};
    this.#sortedIndex = true;
  }
}

module.exports = Queue;