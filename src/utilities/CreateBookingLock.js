const { Mutex } = require("async-mutex");

const bookingLocks = new Map();

const getBookingLock = (serviceId) => {
  const key = serviceId.toString();

  if (!bookingLocks.has(key)) {
    bookingLocks.set(key, new Mutex());
  }

  return bookingLocks.get(key);
};

module.exports = getBookingLock;
