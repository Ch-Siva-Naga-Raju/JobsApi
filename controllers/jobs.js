const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async(req,res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    if(jobs)
        res.status(StatusCodes.OK).json({jobs})
    else
        res.status(StatusCodes.OK).json({jobs: []})
}

const getJob = async(req,res) => {
    const { user: { userId }, params: {id: jobId}} = req;
    const job = await Job.findOne({_id: jobId, createdBy: userId});
    if(job){
        res.status(StatusCodes.OK).json({job})
    }else{
        throw new NotFoundError('No job found with the provided jobId');
    }
}

const createJob = async(req,res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res) => {
    const { user: { userId }, params: { id: jobId }} = req;
    const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId}, req.body, {
        new: true,
        runValidators: true
    })
    if(!job) res.status(StatusCodes.BAD_REQUEST).json({msg: "The user doesn't have the desired job to update"})
    else res.status(StatusCodes.OK).json({msg: `${jobId} is updated.`, newJob: job})
}

const deleteJob = async(req,res) => {
    const { user: { userId }, params: { id: jobId }} = req;
    const job = await Job.deleteOne({_id: jobId, createdBy: userId})
    if(job) res.status(StatusCodes.OK).json({msg: 'Job is deleted'})
    else throw new NotFoundError('No job is found to delete')
}

module.exports = { 
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}