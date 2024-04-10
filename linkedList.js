// The LinkedList and Node Classes that the Queue is built upon.

class LinkedList {
  constructor() {
    this.tail = null;
    this.head = null;
    this.size = 0;
    this.maxNodeIndex = 0;
  }
}

class Node {
  constructor(songId, nodeIndex, prev = null, next = null) {
    this.songId = songId;
    this.nodeIndex = nodeIndex;
    this.prev = prev;
    this.next = next;
  }
}

module.exports = {
  LinkedList,
  Node
}