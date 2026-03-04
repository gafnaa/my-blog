document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const postsContainer = document.getElementById('posts-container');
  const noResults = document.getElementById('no-results');
  const postCards = Array.from(postsContainer.children);

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    let hasResults = false;

    postCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = card.querySelector('p.excerpt')?.textContent.toLowerCase() || '';
      
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = 'block';
        hasResults = true;
      } else {
        card.style.display = 'none';
      }
    });

    if (hasResults) {
      noResults.classList.add('hidden');
    } else {
      noResults.classList.remove('hidden');
    }
  });
});