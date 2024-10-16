// accept http requests, interact with job model, and send responses back to client
const jobModel = require('./jobModel');

const jobController = {
    async findAllJobs(req,res) {
        try {
            const jobs = await jobModel.findAllJobs();
            if (jobs.length>0){
                res.status(200).json(jobs);
            } else {
                res.status(400).json({ message: 'No jobs exist in database' })
            }

        } catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error fetching jobs' });
        }
    },
    async findJobById(req,res) {
        try {
            const jobID = req.params.id;
            const job = await jobModel.findJobById(jobID);
            if (job.length > 0){
                res.status(200).json(job);
            } else {
                res.status(400).json({message: 'Job not found.'})
            }
        } catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error fetching job' });
        }
    },
    async createJob(req,res){
        try {
            const newlycreatedjob = await jobModel.createJob(req.body);
            res.status(201).json(newlycreatedjob);
        } catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error creating job' });
        }
    },
    async findJobByIdAndDelete(req,res){
        try {
            const jobID = parseInt(req.params.id);
            const deletedJob = await jobModel.findJobByIdAndDelete(jobID);
            res.status(200).json(deletedJob);
        } catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error deleting job' });
        }
    },
    async findJobByIdAndUpdate(req,res){
        try {
            const jobtoupdate = req.body;
            const jobID = parseInt(req.params.id);
            const updatedjob = await jobModel.findJobByIdAndUpdate(jobID, jobtoupdate);
            res.status(200).json(updatedjob);
        } catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error updating job' });
        }        
    }
}


module.exports = jobController;