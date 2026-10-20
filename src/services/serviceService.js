const STATUS = require("../constants/httpStatus");
const serviceRepository = require("../repositories/serviceRepository");
const createError = require("../utilities/createError");
const createPagination = require("../utilities/createPagination");

const getServices = async ({search , day , duration , sort , isActive , page , limit})=>{
    const filter = {};
    const sortQuery = {};

    if(search){
        filter.name = {$regex: search , $options: 'i'};
    }

    if(day){
        filter["availability.day"] = day;
    }

    if(duration === "under60"){
        filter.durationMinutes = {$lte: 60};
    } else if (duration === "above60"){
        filter.durationMinutes = {$gte: 60};
    }

    if(sort === "priceAsc"){
        sortQuery.price = 1; 
    } else if(sort === "priceDesc"){
        sortQuery.price = -1; 
    }

    if(isActive){
        filter.isActive = isActive;
    }

    const totalServices = await serviceRepository.getTotalServices(filter);

    const pagination = createPagination({page , limit , totalItems: totalServices});

    const services = await serviceRepository.getServices(filter , sortQuery , pagination);
    return {services , pagination};
}

const getService = async ({serviceId})=>{
    console.log(serviceId);
    
    const filter = {isActive: true , _id: serviceId};
    return await serviceRepository.getService(filter);

}

const createService = async (serviceDetails) => {
    const service =  await serviceRepository.createService(serviceDetails);

    if(!service){
        throw createError("Service not found" , STATUS.NOT_FOUND);
    }

    return service;
}


const updateService = async (serviceDetails) => {
    const updates = {};

    if(serviceDetails.name !== undefined){
        updates.name = serviceDetails.name;
    }

    if(serviceDetails.description !== undefined){
        updates.description = serviceDetails.description;
    }

    if(serviceDetails.price !== undefined){
        updates.price = serviceDetails.price;
    }

    if(serviceDetails.image != null){
        updates.image = serviceDetails.image;
    }

    if(serviceDetails.durationMinutes !== undefined){
        updates.durationMinutes = serviceDetails.durationMinutes;
    }

    if(serviceDetails.isActive !== undefined){
        updates.isActive = serviceDetails.isActive;
    }

    if(serviceDetails.availability !== undefined){
        updates.availability = serviceDetails.availability;
    }

    if(Object.keys(updates).length === 0){
        throw createError("Please update at least one atribute." , STATUS.BAD_REQUEST);
    }

    const uptService = await serviceRepository.updateService({serviceId: serviceDetails.serviceId , updates});

    if(!uptService){
        throw createError("Service not found.", STATUS.NOT_FOUND);
    }

    return uptService;
}



const deactivateService = async (serviceId) => {
  const service = await serviceRepository.updateService({
    serviceId,
    updates: { isActive: false },
  });

  if (!service) {
    throw createError(
      "Service not found.",
      STATUS.NOT_FOUND
    );
  }

  return service;
};

module.exports = {getServices , getService , createService , updateService , deactivateService};