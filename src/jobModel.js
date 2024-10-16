// CRUD functionality for job advertisements
const pool = require('../config/db');

const jobModel = {
  async createJob(job) {
    const { job_title, job_description, company_name, date_posted, original_link, location } = job;
    const results = await pool.query(`
      INSERT INTO jobs (job_title, job_description, company_name, date_posted, original_link, location) 
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (job_title, job_description, company_name, original_link, location) DO NOTHING
      RETURNING *;`, 
      [job_title, job_description, company_name, date_posted, original_link, location]
    )
    return results.rows;
  },

  async findAllJobs() {
    const results = await pool.query("SELECT * FROM jobs;")
    return results.rows;
  },

  async findJobById(jobID) {
    const results = await pool.query("SELECT * FROM jobs WHERE id=$1;", [jobID])
    return results.rows;
  },

  async findJobByIdAndUpdate(jobID, updatedJob) {
    const originalJob = await pool.query("SELECT * FROM jobs WHERE id=$1;", [jobID]);
    const { job_title, job_description, company_name, date_posted, original_link, location } = updatedJob;
    const results = await pool.query(`
      UPDATE jobs 
      SET job_title = $1,
          job_description = $2,
          company_name = $3,
          date_posted = $4,
          original_link = $5,
          location = $6
      WHERE id = $7 
      RETURNING *`, 
      [
        job_title || originalJob.rows[0].job_title, 
        job_description || originalJob.rows[0].job_description, 
        company_name || originalJob.rows[0].company_name, 
        date_posted || originalJob.rows[0].date_posted, 
        original_link || originalJob.rows[0].original_link, 
        location || originalJob.rows[0].location, 
        jobID
      ]);
    return results.rows;
  },

  // async findJobByIdAndUpdate(jobID, updatedJob) {
  //   const allowedFields = ['job_title', 'job_description', 'company_name', 'date_posted', 'original_link', 'location'];
  //   const fieldsToUpdate = {};

  //   for (const field of allowedFields) {
  //     if (field in updatedJob) {
  //       fieldsToUpdate[field] = updatedJob[field];
  //     }
  //   }

  //   if (Object.keys(fieldsToUpdate).length === 0) {
  //     throw new Error('No valid fields provided for update');
  //   }

  //   const query = `
  //     UPDATE jobs 
  //     SET ${Object.keys(fieldsToUpdate).map((field, index) => `${field} = $${index + 1}`).join(', ')}
  //     WHERE id = $${Object.keys(fieldsToUpdate).length + 1} 
  //     RETURNING *`;

  //   console.log('Query string for update:',query);

  //   const params = [...Object.values(fieldsToUpdate), jobID];

  //   const result = await pool.query(query, params);
  //   return result.rows[0];
  // },

  async findJobByIdAndDelete(jobID) {
    const deletedJob = await pool.query("DELETE FROM jobs WHERE id=$1 RETURNING *;", [jobID]);
    return deletedJob.rows;
  }

};

module.exports = jobModel;
