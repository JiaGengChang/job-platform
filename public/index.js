const searchForm = document.getElementById('search-form-1');
const searchResultsTitle = document.getElementById('search-result-title');
const searchResultsDiv = document.getElementById('search-results');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('search-input');
    const url = `/api/v1/jobs/1`
  
    try {
      const response = await fetch(url);
      const html = await response.text();
      const jobs = JSON.parse(html);
      let resultsHTML = '';
      for (const [key, value] of Object.entries(jobs)) {
        resultsHTML += `
          <div class="search-result-card" id="job-result-${key}">
            <p><strong>${value['job_title']}</strong></p>
            <p>${value['location']}</p>
            <p>${value['job_description']}</p>
          </div>
        `;
      }
      searchResultsTitle.innerHTML = `Search results for: <strong>${query.value}</strong>`;
      searchResultsDiv.innerHTML = resultsHTML;
    } catch (error) {
      console.error(error);
    }
  });