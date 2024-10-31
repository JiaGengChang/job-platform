const urlParams = new URLSearchParams(window.location.search);
const jobID = urlParams.get('jobID');
const url=`/api/v1/jobs/${jobID}`
let resultsPlaceholder = document.getElementById('results-placeholder');

async function getJobDetails() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        const { job_title, job_description, company_name, date_posted, original_link, location } = json[0];
        resultsPlaceholder.innerHTML = `
            <div id="content">
            <h1>${job_title}</h1>
            <h2>${company_name}</h2>
            <h2>${location}</h2>
            <h4>Posted on ${new Date(date_posted).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</h4>
            <p>${job_description}</p>
            <p>Link to Apply: <a class=apply-link href="${original_link}">${original_link}</a></p>
            </div>
        `;
    } catch (error) {
        console.error(error);
        resultsPlaceholder.innerHTML = `<p>Failed to load job details</p>`;
    }
}

getJobDetails();
