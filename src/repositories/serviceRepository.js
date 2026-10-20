const Service = require("../models/service");

const getServices = async (filter , sortQuery , pagination) => {
  return Service.find(filter).sort(sortQuery).limit(pagination.limit).skip(pagination.skip);
};

const getService = (filter) => {
  return Service.findOne(filter);
};

const createService = async (serviceDetails) => {
  return Service.create(serviceDetails);
};

const updateService = async ({ serviceId, updates }) => {
  return await Service.findByIdAndUpdate(serviceId, updates, {
    new: true,
    runValidators: true,
  });
};

const getTotalServices = async(filter) => {
  return await Service.countDocuments(filter);
}


module.exports = { getServices, getService, createService, updateService,getTotalServices };
