# Abstract

## High Level overview - main aspect, time complexity, major challenges, idempotency, unit tests
## Paragraph
## Explain solution here WELL bc your approach NEEDS explaining
## Having a paragraph here is ok
## Chose to target O(1)
## Linkedlist and object for queue
## Idempotency thing



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
{ "nodeIndexesAndSongIds": { 2: "songId4", 0: "songId10" }}
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