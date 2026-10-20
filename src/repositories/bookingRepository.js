const Booking = require("../models/booking");

const createBooking = async (resultValues) => {
  return await Booking.create(resultValues);
};

const findBooking = async (filter) => {
  return await Booking.findOne(filter);
};

const getBookings = async (filter , pagination ,populate) => {
  return await Booking.find(filter).populate(populate).limit(pagination.limit).skip(pagination.skip);
};

const totalBookings = async (filter) =>{
  return await Booking.countDocuments(filter);
} 

const getBooking = async (filter , populate) => {
  return await Booking.findOne(filter).populate(populate);
};

const updateBooking = async (filter , updates) => {
  return await Booking.findOneAndUpdate(
    filter,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );
};

const changeStatus = async ({bookingId , status , isActive}) => {
  return await Booking.findByIdAndUpdate(bookingId , {status , isActive} , {new: true , runValidators: true});
}

module.exports = { createBooking, findBooking, getBookings, getBooking , updateBooking , totalBookings , changeStatus };
