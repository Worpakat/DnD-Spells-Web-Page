//TRIE IMPLEMENTATION

class TrieNode {
    constructor() {
        this.children = new Array(26).fill(null);
        this.endOfAWord = false;
        this.link = null;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    getIndexofChar(char) {
        return char.charCodeAt(0) - 'a'.charCodeAt(0);
    }

    getCharOfIndex(index) {
        return String.fromCharCode(index + 'a'.charCodeAt(0));
    }

    insert(key, aTag) {
        key = key.toLowerCase().replace(/\s/g, "");
        let currentNode = this.root;

        for (let c of key) {
            const index = this.getIndexofChar(c);

            if (currentNode.children[index]) {
                currentNode = currentNode.children[index];
                continue;
            }

            const newNode = new TrieNode();
            currentNode.children[index] = newNode;
            currentNode = newNode;
        }

        currentNode.endOfAWord = true;
        currentNode.link = aTag;
    }

    search(key) {
        key = key.toLowerCase().replace(/\s/g, "");
        let currentNode = this.root;

        for (let c of key) {
            const index = this.getIndexofChar(c);

            if (!currentNode.children[index]) {
                return false;
            }
            currentNode = currentNode.children[index];
        }

        if(currentNode.endOfAWord) return currentNode.link;
        else return false;
    }


    getAutoCompletions(prefix) {
        prefix = prefix.toLowerCase().replace(/\s/g, "");
        let currentNode = this.root;
        const options = [];
        
        const recursion = (node, prefix) => {
            if (node.endOfAWord) {
                options.push(node.link);
            }

            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i]) {
                    const nodesWord = prefix + this.getCharOfIndex(i);
                    recursion(node.children[i], nodesWord);
                }
            }
        };

        for (const c of prefix) {
            const index = this.getIndexofChar(c);

            if (!currentNode.children[index]) {
                return options;
            }

            currentNode = currentNode.children[index];
        }

        recursion(currentNode, prefix);
        return options;
    }
}

export const spellsTrie = new Trie(); //Main spells trie.
//This is used for making more efficient searching and auto completion operations.

//============================================================================================

//Search Bar Script File
function removeNonLetters(str) {
    /*Adjust search term to proper comparable form.*/
    return str.replace(/[^a-zA-Z]/g, '');
    //We used here regular expression method.
}

const searchBar = document.getElementById("searchInput");

//Searchs when hit the 'Enter'.
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior (e.g., form submission)
        
        const searchTerm = removeNonLetters(searchBar.value.toLowerCase());

        const result = spellsTrie.search(searchTerm); //Traversing through trie and gets link that looked for.
        
        if (result) result.click(); //If result is a link, clicked on it.
        else console.log("Doesn't matched with any spell!");
    }
});

const suggestionsList = document.getElementById('suggestionsList');
const MAX_SUGGESTIONS = 5; // Maximum number of suggestions to display

//Auto-Completion
searchInput.addEventListener('input', () => {
    
    const preSearchTerm = removeNonLetters(searchBar.value.toLowerCase());
    const suggestions = spellsTrie.getAutoCompletions(preSearchTerm);

    suggestionsList.innerHTML = ''; // Clear previous suggestions

    for (let i = 0; i < Math.min(suggestions.length, MAX_SUGGESTIONS); i++) {
        const suggestion = document.createElement('li');
        suggestion.textContent = suggestions[i].textContent;
        suggestion.dataset.searchKey = suggestions[i].dataset.searchKey;
        suggestionsList.appendChild(suggestion);
    }

    if (suggestionsList.childElementCount > 0) suggestionsList.style.display = "block";
    else suggestionsList.style.display = "none";
    //If there is no suggestion, suggestion list should be hidden.
});

//Event for search input keydown 'Enter'
const hitEnterEvent = new KeyboardEvent("keydown", {
    key: "Enter", 
    bubbles: true, 
    cancelable: true, 
});
//Passes selected suggestion to search bar.
suggestionsList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        searchInput.value = event.target.dataset.searchKey;
        searchInput.dispatchEvent(hitEnterEvent); 
        searchInput.value = event.target.innerHTML;
        suggestionsList.innerHTML = ''; // Clear suggestions
    }
});
