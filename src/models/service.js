const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: [true, "Service name is required."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Service description is required."],
  },
  price: {
    type: Number,
    required: [true, "Service Price is required."],
    min: [0, "Price must be grather than or equal 0"],
  },
    image: {
    type: String,
    required: [true, "Service image is required."],
  },
  durationMinutes: {
    type: Number,
    required: [true, "Service duration Minutes is required."],
    min: [20, "duration Minutes must be grather than or equal 20"],
},
isActive: {
    type: Boolean,
    default: true,
},
availability: [
    {
        day: {
        type: String,
        required: [true, "Day of availability is required."],
        enum: ["Sun" , "Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat"],
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
      },
    },
  ],
} , {timestamps: true});


const Service = mongoose.model("Service" , serviceSchema);

module.exports = Service;