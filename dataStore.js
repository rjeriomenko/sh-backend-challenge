// The queue is instantiated here so it can be imported
// to any file.
const { Queue } = require('./queue');
const queue = new Queue();

module.exports = {
  queue
};