const fs = require('fs'); // to read example job entries
const pool = require('../config/db'); // our PostgreSQL pool

// script to initialize jobs database with some example jobs for testing
// these example jobs are stored in JSON format in `jobs.json`

// Load the JSON array
// same directory as this file
const jobs = JSON.parse(fs.readFileSync('utils/jobs.json', 'utf8'));

// Function to check if an entry already exists
async function checkIfExists(job) {
  const query = {
    text: `
      SELECT * FROM jobs
      WHERE job_title = $1 AND 
      job_description = $2 AND 
      company_name = $3 AND 
      date_posted = $4 AND 
      original_link = $5 AND 
      location = $6
    `,
    values: [
      job.job_title,
      job.job_description,
      job.company_name,
      job.date_posted,
      job.original_link,
      job.location,
    ],
  };

  const result = await pool.query(query);
  return result.rows.length > 0;
}

// Insert each job into the database
// Does not insert duplicate jobs
async function insertJobs() {
  for (const job of jobs) {
    const exists = await checkIfExists(job);
    if (!exists) {
      const query = {
        text: `
          INSERT INTO jobs (job_title, job_description, company_name, date_posted, original_link, location)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        values: [
          job.job_title,
          job.job_description,
          job.company_name,
          job.date_posted,
          job.original_link,
          job.location,
        ],
      };

      await pool.query(query);
      console.log(`Inserted job: ${job.job_title}`);
    } else {
      console.log(`Job already exists: ${job.job_title}`);
    }
  }
}

// Run the insertJobs function to load jobs.json into our postgres database
insertJobs();