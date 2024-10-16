// accept http requests, interact with jobs model, and send responses back to client

const { Router } = require('express');
const router = Router();
const jobController = require('./jobController.js');

router.get("/", jobController.findAllJobs);
router.post("/", jobController.createJob);
router.get("/:id", jobController.findJobById);
router.patch("/:id", jobController.findJobByIdAndUpdate);
router.delete("/:id", jobController.findJobByIdAndDelete);

module.exports = router;