// public/script.js

// Admin Upload Script
if (document.getElementById('uploadForm')) {
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    document.getElementById('message').textContent = result.message || 'Upload failed.';
  });
}

// User Search Script
if (document.getElementById('searchForm')) {
  document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const params = new URLSearchParams(formData);
    const response = await fetch(`/search?${params}`);
    const results = await response.json();

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    if (results.length > 0) {
      // Table Header
      const headerRow = document.createElement('tr');
      Object.keys(results[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Table Body
      results.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(val => {
          const td = document.createElement('td');
          td.textContent = val;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    } else {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = "10";
      td.textContent = "No results found.";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(table);
  });
}
