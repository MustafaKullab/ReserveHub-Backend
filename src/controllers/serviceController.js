const STATUS = require("../constants/httpStatus");
const servicesService = require("../services/serviceService");

const getServices = async (req, res) => {

  const {search , day , duration , sort , isActive, page , limit} = req.query;

  const {services , pagination} = await servicesService.getServices({search , day , duration , sort , isActive, page , limit});

  res.status(STATUS.OK).json({ success: true, services , pagination });
};

const getService = async (req, res) => {
  const { serviceId } = req.params;

  const service = await servicesService.getService({ serviceId });

  return res.status(STATUS.OK).json({ success: true, service });
};

const createService = async (req, res) => {
  const { name, description, price, durationMinutes, isActive, availability } =
    req.body;

  const image = req.file ? `/uploads/${req.file.filename}`: null;

  const serviceDetails = {
    name,
    description,
    price,
    image,
    durationMinutes,
    isActive,
    availability,
  };


  const service = await servicesService.createService(serviceDetails);

  res.status(STATUS.CREATED).json({ success: true, service });
};

const updateService = async (req, res) => {
  const { name, description, price, durationMinutes, isActive, availability } =
    req.body;
  const { serviceId } = req.params;

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const serviceDetails = {
    serviceId,
    name,
    description,
    price,
    image,
    durationMinutes,
    isActive,
    availability,
  };

  const service = await servicesService.updateService(serviceDetails);

  return res.status(STATUS.OK).json({ success: true, service });
};

const disabledService = async (req, res) => {
  const { serviceId } = req.params;

  const service = await servicesService.deactivateService(serviceId);

  return res.status(STATUS.OK).json({ suucess: true, service });
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  disabledService,
};
