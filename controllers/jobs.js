const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort(
      "createdAt"
    );
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } catch (error) {
    console.log(error);
  }
};

const createJob = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    console.log(error);
  }
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`There Is Not Job With Id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!company || !position) {
    throw new BadRequestError("Company And Position Must Be Provided");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`There is no job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).send({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  res.status(StatusCodes.OK).json({ msg: "Job Was Deleted Successful" });
};

module.exports = {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
};
