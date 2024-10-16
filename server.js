const express = require('express');
const jobRoutes = require('./src/jobRoutes.js');
const userRoutes = require('./src/userRoutes.js');
const authRoutes = require('./src/authRoutes.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //allow return of json data

app.get("/", (req,res)=>{res.send('Index page goes here');});
app.use("/api/v1/jobs", jobRoutes); // CRUD for job postings
app.use("/api/v1/users", userRoutes); // CRUD for user accounts
app.use("/api/v1/auth", authRoutes); // login, register, sign-out

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
