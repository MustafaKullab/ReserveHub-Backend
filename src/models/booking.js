const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    startTime: {
      type: Date,
      required: [true, "Time Start of service is required."],
    },

    endTime: {
      type: Date,
      required: [true, "Time End of service is required."],
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { serviceId: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
