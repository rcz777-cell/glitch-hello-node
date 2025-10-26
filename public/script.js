const form = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const namesList = document.getElementById('namesList');

async function fetchNames() {
  try {
    const response = await fetch('/names');
    if (!response.ok) throw new Error('Failed to fetch names');
    const names = await response.json(); // expecting an array of strings
    namesList.innerHTML = '';
    names.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      namesList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (name === '') return;

  try {
    const response = await fetch('/names', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to submit name');

    nameInput.value = '';
    nameInput.focus();

    // Refresh the list after successful submission
    await fetchNames();
  } catch (error) {
    console.error(error);
  }
});

// Initial fetch when page loads
fetchNames();
