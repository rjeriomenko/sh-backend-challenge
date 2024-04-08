class LinkedList {
  constructor() {
    this.tail = null;
    this.size = 0;
  }
}

class Node {
  constructor(songId, prev = null, next = null) {
    this.songId = songId;
    this.prev = prev;
    this.next = next;
  }
}

module.exports = {
  LinkedList,
  Node
}