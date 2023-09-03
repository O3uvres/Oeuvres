function getItem(items) {
    /* Fonction qui s'occupe de récupérer les paramètres dans l'url pour afficher la bonne page */
    var parameters = location.search.substring(1).split("&"); // .substring(1) pour enlever le "?"
    console.log("location.search : " + location.search);

    for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[i].split("=");
        let pName = parameter[0]; // Car name il ne voulait pas
        let value = parameter[1];
        value = decodeURIComponent(decodeURIComponent(value));

        if (pName == "item") {
            url_name = decodeURI(value);

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.url == url_name) {
                    return item;
                }
            }
        }
    }
    return null;
}

function createNoItemPage() {
    const sectionContainer = document.querySelector(".container");

    const error = document.createElement("h1");
    error.classList = ["error-message"];
    error.innerText = "Cette URL ne renvoie vers aucune oeuvre.";
    
    sectionContainer.appendChild(error);
}

function createItemPage(item) {
    const sectionContainer = document.querySelector(".container");


    /// création de la div "Image"
    const imageDiv = document.createElement("div");
    imageDiv.classList = ["image-div"];

    /* Création de l'image */
    const srcElement = document.createElement("img");
    console.log("article.src", item.src);
    srcElement.src = item.src;
    imageDiv.appendChild(srcElement)
    sectionContainer.appendChild(imageDiv)
    

    /// création de la div "information" dans laquelle se trouve toutes les informations 
    /// telles que le nom de l'auteur, la date, le lieu de conservation ...
    const infoDiv = document.createElement("div");
    infoDiv.classList = ["info-div"];

    // Sous div "title"
    const titleDiv = document.createElement("div");
    titleDiv.classList = ["title-div"];

    const nomElt = document.createElement("h1");
    nomElt.innerText = item.name;
    const authorElt = document.createElement("h2");
    authorElt.innerText = item.author;

    // Sous div "detail"
    const detailDiv = document.createElement("div");
    detailDiv.classList = ["detail-div"];

    const titleDetailsElt = document.createElement("h3");
    titleDetailsElt.innerText = "Informations : ";
    const materiauEtSupportElt = document.createElement("p");
    materiauEtSupportElt.innerText = "materiau et support : " + item["materiau et support"];
    const dimensionsElt = document.createElement("p");
    dimensionsElt.innerText = "dimensions : " + item["dimensions"];
    const dateElt = document.createElement("p");
    dateElt.innerText = "date : " + item["date"];
    const lieuDeConservationElt = document.createElement("p");
    lieuDeConservationElt.innerText = "lieu de conservation : " + item["lieu de conservation"];

    // Ajout des élements à la div "information"
    titleDiv.appendChild(nomElt);
    titleDiv.appendChild(authorElt);
    detailDiv.appendChild(titleDetailsElt);
    detailDiv.appendChild(materiauEtSupportElt);
    detailDiv.appendChild(dimensionsElt);
    detailDiv.appendChild(dateElt);
    detailDiv.appendChild(lieuDeConservationElt);
    infoDiv.appendChild(titleDiv);
    infoDiv.appendChild(detailDiv);
    sectionContainer.appendChild(infoDiv);



    /* Ajout des éléments créés à l'HTML */


    /// Création de la div "Categories" dans laquelle se trouve les filtres des différentes catégories
    const categoriesDiv = document.createElement("div");
    categoriesDiv.classList = ["categories-div"];

    // Création de tous les éléments de cette div
    const titleCategoriesElt = document.createElement("h3");
    titleCategoriesElt.innerText = "Caractéristiques : ";
    const representationElement = document.createElement("p");
    representationElement.innerText =  `Représentation: ${item.representation}/5`
    const imageElement = document.createElement("p");
    imageElement.innerText =  `Image: ${item.image}/5`
    const materialiteElement = document.createElement("p");
    materialiteElement.innerText =  `Matérialité: ${item.materialite}/5`
    const processusElement = document.createElement("p");
    processusElement.innerText = `Procéssus: ${item.processus}/5`
    const presentationElement = document.createElement("p");
    presentationElement.innerText =  `Représentation: ${item.presentation}/5`
    
    // Ajout des filtres à la div "Categories"
    sectionContainer.appendChild(categoriesDiv)
    categoriesDiv.appendChild(titleCategoriesElt)
    categoriesDiv.appendChild(representationElement)
    categoriesDiv.appendChild(imageElement)
    categoriesDiv.appendChild(materialiteElement)
    categoriesDiv.appendChild(processusElement)
    categoriesDiv.appendChild(presentationElement)
}




window.addEventListener("load", async () => {
    
    const json = await fetch("JSON/oeuvres.json");
    const items = await json.json();
    const item = getItem(items);
    console.log("item :", item);
    if (item == null) {
        createNoItemPage();
    }
    else {
        createItemPage(item)
    }
});