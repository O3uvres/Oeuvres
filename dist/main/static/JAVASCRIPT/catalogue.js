
function createItem (item) {
    // Création d'un bloque pour l'item
    const itemElement = document.createElement("div");
    itemElement.classList = ["item"];

    // Ajout d'une image en fond
    itemElement.style.backgroundImage = "url(" + item.src + ")";
    
    // Creation du nom et de l'auteur qui s'afficheront par dessus l'image grâce à la position absolue
    const itemContentDiv = document.createElement("div");
    itemContentDiv.classList = ["item-content"];

    const nameElement = document.createElement("h3");
    nameElement.innerText = item.name;
    const authorElement = document.createElement("p");
    authorElement.innerText = item.author;

    itemContentDiv.appendChild(nameElement);  
    itemContentDiv.appendChild(authorElement);

    itemElement.appendChild(itemContentDiv);

    // Création du form qui permettra d'accéder à l'oeuvre quand on clique dessus
    // const formElement = document.createElement("form");
    // formElement.action = "/oeuvres/" + item.url;
    // const hiddenButton = document.createElement("input");
    // hiddenButton.type = "Submit";
    // hiddenButton.value = "Voir l'oeuvre";
    const linkElement = document.createElement("a");
    linkElement.href = "/oeuvres/" + item.url;
    linkElement.innerText = "Voir l'oeuvre";
    itemElement.appendChild(linkElement);

    // Ajout de l'item au html
    ITEMS_SECTION.appendChild(itemElement);
}

function updateItems (items) {
    /* Fonction qui supprime tous les articles de la page puis réaffiche la liste des articles
    passés en paramètre */
    ITEMS_SECTION.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        createItem(items[i]);
    }
}


function similarity(wordA, wordB) {
    /* Fonction qui compare deux mots et qui dit s'ils sont similaires ou différents
    Retourne une valeur en 0 et 1:
    - 1 : les deux mots sont identiques
    - 0 : les deux mots n'ont rien à voir 
    Complexité : wordA.length * wordB.length 
    Inventé par Raphaël BELLIOT (j'en suis très fier)*/

    // On met tout en minuscule pour éviter les problèmes
    wordA = wordA.toLowerCase();
    wordB = wordB.toLowerCase();
    // On regarde quel mot est le plus petit
    var shortWord = (wordA.length <= wordB.length) ? wordA : wordB;
    var longWord =  (wordA.length > wordB.length) ? wordA : wordB;
    var shortSize = shortWord.length;
    var longSize = longWord.length;

    let caracters = wordA.split("");

    // On parcourt le plus grand mot pour calculer les différences avec le petit
    // On le parcours plusieurs fois en décalant le petit mot pour faire face au préfixe
    // Les espaces on s'en fout
    var maxSimi = 0;
    for (let start = -shortSize; start < longSize; start++) {
        var cptSimi = 0;
        for (let i = 0; i < shortSize; i++) {
            // A chaque on compare avec la lettre avant et après pour éviter d'éliminer les fautes de frappes
            for (let j = -1; j <= 1; j++) {
                var pos = start + i + j;
                if (pos >= 0 && pos < longSize) {
                    if (shortWord[i] == longWord[pos]) {
                        cptSimi += 1;
                        break;
                    }
                }
            }
        }
        if (cptSimi > maxSimi) {
            maxSimi = cptSimi;
        }
    }

    var ratio = maxSimi / longSize;
    var similarity = ratio ** 2;

    return similarity;
}
function sentenceSimiliraty(sentenceA, sentenceB) {
    let wordsA = sentenceA.split(" ");
    let wordsB = sentenceB.split(" ");

    let somme = 0 // Somme des différences entre les mots
    for (let i = 0; i < wordsA.length; i++) {
        let wordA = wordsA[i];
        for (let j = 0; j < wordsB.length; j++) {
            let wordB = wordsB[j];
            somme += similarity(wordA, wordB) ** 2;
        }
    }

    if (wordsA.length > wordsB.length) {
        return somme / wordsA.length;
    }
    else {
        return somme / wordsB.length;
    }
}

function compareSearchItem(search, item) {
    return sentenceSimiliraty(search, item.author) + sentenceSimiliraty(search, item.name);
}

function search(words, items) {
    /* (str, list) -> list
    Renvoie la liste d'items triée pour correspondre au mieux aux mots recherchés */
    let ordonnedItems = Array.from(items);
    ordonnedItems = ordonnedItems.filter(item => compareSearchItem(words, item) >= 0);
    ordonnedItems.sort((itemB, itemA) => compareSearchItem(words, itemA) - compareSearchItem(words, itemB));
    return ordonnedItems;
}

function distance(categories, item) {
    /* (dict, jsonObject) 
    pré-condtion : les clés des catégories doivent correspondre aux nom des variables dans le fichier JSON */

    // On fait la somme des carrés en xA et xB par exemple 
    let sum = 0;
    for (var[name, value] of categories) {
        sum += (value - item[name]) ** 2;
    }
    // Puis on fait la racine carré de cette somme pour obtenir la distance
    return sum ** 0.5;
}

function filter(categories, items) {
    /* (bool, int, int, dict, list) -> list
    Renvoie la liste d'items triée pour correspondre au mieux au filtres sélectionées */
    const ordonnedItems = Array.from(items);

    /// Ensuite on s'attaque aux filtres qui ordonnent les oeuvres (les catégories)
    // Pour cela on calcule la distance en N dimensions entre les filtres sélectionnées et l'oeuvre pour ne pas les calculer plusieurs fois
    // (N est le nombre de catégories)
    // const distances = new Map(items, ordonnedItems.map(item => distance(categories, item))); // sert à rien pour l'instant car jsp comment faire pour l'inclure dans la fonction sort !!!
    //                                                                                     // Et marche surement pas
    
    //ordonnedItems.sort((a, b) => distance(categories, a) - distance(categories, b)) // a est avant b si a est plus proche que b des catégories 
    ordonnedItems.sort(function (a, b) {
        return distance(categories, a) - distance(categories, b);
    });
    
    // On renvoie la liste de nos items ordonnés
    return ordonnedItems;
}

function searchAndFilterDistance(words, categories, item) {
    return compareSearchItem(words, item) + distance(categories, item);
}

function SearchAndFilter(words, categories, items) {
    let ordonnedItems = Array.from(items);
    ordonnedItems.sort((itemB, itemA) => compareSearchItem(words, itemA) - compareSearchItem(words, itemB));
    return ordonnedItems;
}

function update() {
    /* Fonction principale qui affiche tous les éléments en fonction des filtres et de la recherche */

    // On récupère tous les valeurs de tous les filtres
    const categories = new Map();
    for (let i = 0; i < categoriesInputs.length; i++) {
        categories.set(CATEGORIES_NAMES[i], categoriesInputs[i].value);
    }

    let ordonnedItems;
    if (searchValue == "") {
        ordonnedItems = filter(categories, items);
    }
    else {
        ordonnedItems = search(searchValue, items);
    }
    
    updateItems(ordonnedItems);
}

function changeURL() {
    /* Fonction qui change l'url pour pour actualiser les filtres */
    
    // On récupère tous les valeurs de tous les filtres
    const categories = new Map();
    for (let i = 0; i < categoriesInputs.length; i++) {
        categories.set(CATEGORIES_NAMES[i], categoriesInputs[i].value);
    }

    const filtersForm = document.querySelector(".filters");
    filtersForm.submit();
}

function initialize() {
    /* Fonction qui s'occupe de récupérer les paramètres dans l'url pour afficher la bonne page */
    var parameters = location.search.substring(1).split("&"); // .substring(1) pour enlever le "?"

    for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[i].split("=");
        let pName = parameter[0]; // Car name il ne voulait pas
        let value = parameter[1];
        value = decodeURIComponent(decodeURIComponent(value));

        if (pName == "search") {
            searchValue = decodeURI(value);
        }
        else if (CATEGORIES_NAMES.includes(pName)) {
            let index = CATEGORIES_NAMES.indexOf(pName);
            categoriesInputs[index].value = value;
        }
    }
}


var items;
var FILTERS_SECTION, ITEMS_SECTION;
var searchBarInput;
var searchValue = "";
const CATEGORIES_NAMES = ["representation", "image", "materialite", "processus", "presentation"];
var categoriesInputs;

window.addEventListener("load", async () => {
    const reponse = await fetch("/oeuvres");
    items = await reponse.json();

    FILTERS_SECTION = document.querySelector(".filters-section");
    ITEMS_SECTION = document.querySelector(".items-section");


    /// On s'occupe des FILTRES et de la Search bar
    // Search bar 
    searchBarInput = document.querySelector("#search-bar");
    //searchBarInput.addEventListener("input", update);

    // Catégories
    categoriesInputs = [];
    // On récupère d'abord les catégories et on les relie à la fonction filter
    for (let i = 0; i < CATEGORIES_NAMES.length; i++) {
        const categoryInput = document.querySelector("#" + CATEGORIES_NAMES[i] + "-filter")
        categoryInput.addEventListener("change", changeURL)
        categoriesInputs.push(categoryInput); // .append
    }

    initialize(); // Actualisation des filtres et de la seach bar en fonction de l'URL
    update(); // Acualisation des oeuvres en fonction des filtres et de la search bar
});




