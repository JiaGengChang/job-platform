// Function to load HTML content into a placeholder
function loadHTML(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
  }
  // Load header and footer
loadHTML('header.html', 'header-placeholder');
loadHTML('footer.html', 'footer-placeholder');
  