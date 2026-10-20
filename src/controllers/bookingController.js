const bookingService = require("../services/bookingService");

const STATUS = require("../constants/httpStatus");

const createBooking = async (req,res) => {
    const { serviceId , startTime } = req.body;
    const userId = req.user._id;

    const bookingDetails = {userId , serviceId , startTime};

    const booking = await bookingService.createBooking(bookingDetails);

    return res.status(STATUS.CREATED).json({success: true , booking});
}


const getBookings = async (req,res) => {
    const {_id: userId , role} = req.user;
    const {status , search , page , limit , scope} = req.query;

    const result = await bookingService.getBookings({userId , role , status, search , page , limit , scope});

    return res.status(STATUS.OK).json({success: true , result});
}

const getBooking = async (req,res) => {
    const {_id: userId , role} = req.user;
    const {bookingId} = req.params;

    const booking = await bookingService.getBooking({userId , bookingId , role});

    return res.status(STATUS.OK).json({success: true , booking});
}


const cancleBooking = async (req , res) => {
    const {_id: userId } = req.user;
    const {bookingId} = req.params;

    const booking = await bookingService.cancleBooking({userId , bookingId});

    return res.status(STATUS.OK).json({success: true , booking});
}


const changeStatus = async (req,res) => {
    const {bookingId} = req.params;
    const {status} = req.body;
    
    const booking = await bookingService.changeStatus({bookingId , status});
    return res.status(STATUS.OK).json({success: true , booking});
}

module.exports = { createBooking , getBookings , getBooking, cancleBooking , changeStatus };