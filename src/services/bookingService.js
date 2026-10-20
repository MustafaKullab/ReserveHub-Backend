const STATUS = require("../constants/httpStatus");
const serviceRepository = require("../repositories/serviceRepository");
const bookingRepository = require("../repositories/bookingRepository");
const createError = require("../utilities/createError");
const getBookingLock = require("../utilities/CreateBookingLock");
const CreatePagination = require("../utilities/createPagination");

const createBooking = async (bookingDetails) => {
  const startTime = new Date(bookingDetails.startTime);

  const service = await serviceRepository.getService({
    _id: bookingDetails.serviceId,
  });

  if (!service) {
    throw createError("Service not found.", STATUS.NOT_FOUND);
  }

  if (!service.isActive) {
    throw createError("Service is deactive.", STATUS.BAD_REQUEST);
  }

  if (startTime.getTime() <= Date.now()) {
    throw createError("startTime must be in the future.", STATUS.BAD_REQUEST);
  }

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const bookingDay = DAYS[startTime.getDay()];

  const daySchedules = service.availability.filter(
    (schedule) => schedule.day === bookingDay
  );

  if (daySchedules.length === 0) {
    throw createError(
      "Service is not available on this day.",
      STATUS.BAD_REQUEST
    );
  }

  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + service.durationMinutes);

  const bookingStart = startTime.getHours() * 60 + startTime.getMinutes();
  const bookingEnd = endTime.getHours() * 60 + endTime.getMinutes();

  // هل هناك ع الاقل موعد واحد صالح ؟
  const fitsSchedule = daySchedules.some((schedule) => {
    const [FromHours, FromMinutes] = schedule.from.split(":").map(Number);
    const [ToHours, ToMinutes] = schedule.to.split(":").map(Number);

    const scheduleStart = FromHours * 60 + FromMinutes;
    const scheduleEnd = ToHours * 60 + ToMinutes;

    return bookingStart >= scheduleStart && bookingEnd <= scheduleEnd;
  });

  if (!fitsSchedule) {
    throw createError(
      "Selected time is outside service availability.",
      STATUS.BAD_REQUEST
    );
  }

  const resultValues = {
    userId: bookingDetails.userId,
    serviceId: bookingDetails.serviceId,
    startTime,
    endTime,
  };

  const queryOverlapBooking = {
    serviceId: bookingDetails.serviceId,
    isActive: true,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };

  // اي لا نجعل حدا يحجز نفس الخدمة قبل م الاول يخلص حجزه race condition هنا بنعمل زي قفل عشان نحل مشكلة الـ
  const bookingLock = getBookingLock(bookingDetails.serviceId);

  // runExclusive تعني شغل الكود الموجود داخل هذه الدالة بشكل حصري
  return bookingLock.runExclusive(async () => {
    // الفحص والانشاء لازم يكونوا بنفس القفل لكي لا يحصل ريس كونديشن
    const overlapBooking =
      await bookingRepository.findBooking(queryOverlapBooking);

    if (overlapBooking) {
      throw createError(
        "This time conflicts with another booking.",
        STATUS.CONFLICT
      );
    }

    const booking = await bookingRepository.createBooking(resultValues);

    return booking;
  });
};

const getBookings = async ({ userId, role, status, search, page, limit , scope="mine" }) => {
  const baseFilter = {};
  const populate = "serviceId userId";

  console.log(scope);
  
  
  if (scope !== "mine" && scope !== "all") {
    throw createError("Invalid booking scope." , STATUS.BAD_REQUEST);
  }
  
  if (scope === "all" && role !== "admin") {
      throw createError("Access denied.", STATUS.FORBIDDEN);
  }

  if(scope === "mine"){
    baseFilter.userId = userId;
  }

  const filter = {...baseFilter};

  if (status) {
    filter.status = status;
  }

  
  if (search) {
    const services = await serviceRepository.getServices({
      name: { $regex: search, $options: "i" }
    } , {} , {limit: 0 , skip: 0});
  
    const serviceIds = services.map((service) => service._id);
    filter.serviceId = { $in: serviceIds };
  }

  const totalBookings = await bookingRepository.totalBookings(filter);

  const totalCount = await bookingRepository.totalBookings(baseFilter);

  const pendingCount = await bookingRepository.totalBookings({
    ...baseFilter,
    status: "pending",
  });
  const confirmedCount = await bookingRepository.totalBookings({
    ...baseFilter,
    status: "confirmed",
  });
  const completedCount = await bookingRepository.totalBookings({
    ...baseFilter,
    status: "completed",
  });
  const cancelledCount = await bookingRepository.totalBookings({
    ...baseFilter,
    status: "cancelled",
  });

  const pagination = CreatePagination({
    page,
    limit,
    totalItems: totalBookings,
  });



  const counts = {
    total: totalCount,
    pending: pendingCount,
    confirmed: confirmedCount,
    completed: completedCount,
    cancelled: cancelledCount,
  };


  const bookings = await bookingRepository.getBookings(
    filter,
    pagination,
    populate
  );

  return { bookings, pagination , counts };
};

const getBooking = async ({ userId, bookingId, role }) => {
  const filter = { _id: bookingId };

  if (role !== "admin") {
    filter.userId = userId;
  }

  const populate = (["serviceId" , "userId"]);

  const booking = await bookingRepository.getBooking(filter , populate);

  if (!booking) {
    throw createError("Booking not found.", STATUS.NOT_FOUND);
  }

  return booking;
};

const cancleBooking = async ({ userId, bookingId }) => {
  const filter = { _id: bookingId , userId , status: { $in: ["pending", "confirmed"] }};

  const updates = { status: 'cancelled', isActive: false };

  const booking = await bookingRepository.updateBooking(filter, updates);

  if (!booking) {
    throw createError("Booking not found.", STATUS.NOT_FOUND);
  }

  return booking;
};


const changeStatus = async ({bookingId , status}) => {
  const currentBooking = await bookingRepository.getBooking({_id: bookingId});
  const allowedTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"]
  };

  if(!currentBooking){
    throw createError("Booking not found." , STATUS.NOT_FOUND);

  }

  const allowed = allowedTransitions[currentBooking.status] ?? [];


  if (!allowed.includes(status)) {
    throw createError("Invalid booking status transition.", STATUS.BAD_REQUEST);
  }
  
  if(status === 'completed'){
    if(new Date(currentBooking.endTime).getTime() > new Date().getTime()){
      throw createError("Booking cannot be completed before its end time.", STATUS.BAD_REQUEST);

    }
  }

  const updatedBooking = await bookingRepository.changeStatus({bookingId , status , isActive: status !== 'cancelled'});

  return updatedBooking;
}

module.exports = { createBooking, getBookings, getBooking, cancleBooking , changeStatus};
