document.addEventListener('DOMContentLoaded', function () {
    const wordInput = document.getElementById('wordInput');
    const searchButton = document.getElementById('searchButton');
    const definitionElement = document.getElementById('definition');
    const likeButton = document.getElementById('likeButton');
    const likedList = document.getElementById('liked-list');
    const searchedList = document.getElementById('searched-list');
    const likedWordsContainer = document.getElementById('liked-words');
    const searchedWordsContainer = document.getElementById('searched-words');
    const wordListContainer = document.getElementById('word-list-container');

    let likedWords = [];
    let searchedWords = [];

    // Event listener for the search button
    searchButton.addEventListener('click', function () {
        const word = wordInput.value.trim();
        if (word !== '') {
            getWordDefinition(word);
            addSearchedWord(word);
            likeButton.style.display = 'block'; 
        }
    });

    // Event listener for the like button
    likeButton.addEventListener('click', function () {
        const word = wordInput.value.trim();
        if (word !== '' && !likedWords.includes(word)) {
            likedWords.push(word);
            addLikedWord(word);
            alert(`Word "${word}" added to liked words!`);
        }
    });

    // Event listener for toggling liked words visibility
    likedWordsContainer.addEventListener('click', function () {
        toggleVisibility(likedWordsContainer, likedList);
    });

    // Event listener for toggling searched words visibility
    searchedWordsContainer.addEventListener('click', function () {
        toggleVisibility(searchedWordsContainer, searchedList);
    });

    // Event listener for displaying definition when a liked word is clicked
    likedList.addEventListener('click', function (event) {
        const clickedWord = event.target.textContent.trim();
        if (clickedWord !== '') {
            wordInput.value = clickedWord;
            getWordDefinition(clickedWord);
            likeButton.style.display = 'none'; 
        }
    });

    // Event listener for displaying definition when a searched word is clicked
    searchedList.addEventListener('click', function (event) {
        const clickedWord = event.target.textContent.trim();
        if (clickedWord !== '') {
            wordInput.value = clickedWord;
            getWordDefinition(clickedWord);
            likeButton.style.display = 'block'; 
        }
    });

    // Function to fetch word definition from the Dictionary API
function getWordDefinition(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                let definitionsHTML = '';

                data.forEach(entry => {
                    if (entry.meanings && entry.meanings.length > 0) {
                        entry.meanings.forEach(meaning => {
                            if (meaning.definitions && meaning.definitions.length > 0) {
                                meaning.definitions.forEach(definition => {
                                    const type = meaning.partOfSpeech || 'Not available';
                                    const pronunciation = entry.phonetics && entry.phonetics[0] && entry.phonetics[0].text;

                                    definitionsHTML += `<strong>Definition:</strong> ${definition.definition || 'Not available'}<br>`;
                                    definitionsHTML += `<strong>Type:</strong> ${type}<br>`;
                                    definitionsHTML += `<strong>Pronunciation:</strong> ${pronunciation || 'Not available'}<br><br>`;
                                });
                            }
                        });
                    }
                });

                definitionElement.innerHTML = definitionsHTML;
                likeButton.style.display = 'block';
            } else {
                definitionElement.textContent = 'Word not found.';
                likeButton.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching word definition:', error);
            definitionElement.textContent = 'An error occurred. Please try again later.';
            likeButton.style.display = 'none';
        });
}

    // Function to add a word to the liked list
    function addLikedWord(word) {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        likedList.appendChild(listItem);
    }

    // Function to add a word to the searched list
    function addSearchedWord(word) {
        if (!searchedWords.includes(word)) {
            searchedWords.push(word);
            const listItem = document.createElement('li');
            listItem.textContent = word;
            searchedList.appendChild(listItem);
        }
    }

    // Function to toggle visibility of the word list
    function toggleVisibility(container, list) {
        const maxHeight = list.style.maxHeight;
        if (maxHeight) {
            container.style.borderBottom = '1px solid #ddd';
            list.style.maxHeight = null;
        } else {
            container.style.borderBottom = 'none';
            list.style.maxHeight = list.scrollHeight + 'px';
        }
    }
});
