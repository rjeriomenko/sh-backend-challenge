# Abstract

To create a queue that meets the general requirements, my first step was to consider my options for the underlying data structure that would represent the queue. I wanted an implementation that had low time complexity and good idempotency. I initially considered an array because of its simplicity and the fact that playlists don't typically have 500,000+ songs in them. However, I wanted to demonstrate that I am capable of a faster queue implementation. My biggest challenge was to implement a data structure that allowed for O(1) removals of individual songs from the queue. Ultimately, I built a queue with a doubly linked list and a JavaScript object.

The doubly linked list is built with nodes that store songId's--a unique identifier for songs--and a nodeIndex--a unique identifier for node positions. The Javascript object stores the nodeIndex and a reference to the node that corresponds to the nodeIndex. As songs are appended to or removed from the queue, they linked to/unlinked from the other nodes in the doubly linked list and added to/removed from the JavaScript object as an entry. This queue implementation allows the client to access songs, append songs, and remove songs from the doubly linked list with O(1) time. This approach also offers good idempotency on the "remove-song" route because combinations of nodeIndex and songId will always be unique, so the same delete command will never delete more than one song.

I also implemented a suite of unit tests that test all test cases I thought were necessary to confirm that my application fulfills the general requirements.

# Dependencies
``
node, npm, express, jest, supertest
``

# Commands
### To install dependencies:
```
npm i
```

### To start server on port 3000:
```
npm start
```

### To run tests:
```
npm test
```
### Unit tests are located in
```
 __tests__/queuesRouter.test.js
```

# Endpoints
### REST API Endpoints are located in routers/queuesRouter.js

## To get all songs in queue
### Make GET request to:
```
localhost:3000/api/v1/queues
```

## To append 1+ songs to queue
### Make POST request to:
```
localhost:3000/api/v1/queues/add-song
```
#### With a request body that has a JSON like:
```js
{ "songIds": [ "songId10", "songId2", "songId4", "song10"] }
```
In the array, songId's are Strings that identify songs. They each represent one song. Multiples of the same songId may appear in the queue. If the queue was used to play songs, each copy of the same songId should play the same song.

## To remove 1+ songs from queue
### Make DELETE request to:
```
localhost:3000/api/v1/queues/remove-song
```
### With a request body that has a JSON like:
```js
{ "nodeIndexesAndSongIds": { "2": "songId4", "0": "songId10" } }
```
In the nested object, the keys are nodeIndex and the values are songId. nodeIndex's are integers that represent the position of nodes relative to one another in the queue's underlying linked list. They will always be unique and do not have to be contiguous.

# Prompt

## Problem Statement:
For our live station feature, we need to support the ability for a user to curate and manage a list
of songs to play in a particular order. We want to allow a user to enqueue a list of songs that
play in the correct order for their listeners, and also give that user the ability to add or remove
songs at any time. The songs can be removed from any position within the list, and adding to
the list will append to the end of the list. One-or-many songs can be added/removed at a time.
Also, the user can add the same song as many times as they would like.

## Desired Solution:
Build a REST API which maintains the state of the queue for a single user described above
in-memory. The API should implement sufficient endpoints to enable all of the described
functionalities.

## General Requirements:
1. Should be able to add 1+ songs to the queue
2. Should be able to remove 1+ songs from the queue
3. Should be able to add the same song multiple times
4. When removing songs from the queue, removing the same song should not
remove all entries of that song
5. The state must be maintained in memory