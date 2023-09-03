function encodeMessage(message) {
    var y=document.createElement('span');
    y.innerHTML=message;
    return y.innerHTML;
}
  
function showMessage(status) {
    if (status == 200) {
      alert(encodeMessage("L'oeuvre a été supprimée avec succès !"))
    } 
    else if (status == 500) {
      alert(encodeMessage("Erreur lors de la suppression de l'oeuvre."))
    }
}



function createNoItemPage() {
    const sectionContainer = document.querySelector(".container");
    sectionContainer.innerHTML = "";

    const error = document.createElement("h1");
    error.classList = ["error-message"];
    error.innerText = "Cette URL ne renvoie vers aucune oeuvre.";
    
    sectionContainer.appendChild(error);
}

function createItemPage(item) {
    /* Création de l'image */
    const imageElt = document.querySelector(".item-picture");
    imageElt.src = item.src;
    

    /// création de la div "information" dans laquelle se trouve toutes les informations 
    /// telles que le nom de l'auteur, la date, le lieu de conservation ...
    // Sous div "title"
    const nomElt = document.querySelector(".item-name");
    nomElt.innerText = item.name;
    const authorElt = document.querySelector(".item-author");
    authorElt.innerText = item.author;
    // Sous div "detail"
    const materiauEtSupportElt = document.querySelector(".item-materiau-et-support");
    materiauEtSupportElt.innerText = "materiau et support : " + item["materiau et support"];
    const dimensionsElt = document.querySelector(".item-dimensions");
    dimensionsElt.innerText = "dimensions : " + item["dimensions"];
    const dateElt = document.querySelector(".item-date");
    dateElt.innerText = "date : " + item["date"];
    const lieuDeConservationElt = document.querySelector(".item-lieu-de-conservation");
    lieuDeConservationElt.innerText = "lieu de conservation : " + item["lieu de conservation"];

    /// Création de la div "Categories" dans laquelle se trouve les filtres des différentes catégories
    // Création de tous les éléments de cette div
    const representationElement = document.querySelector(".item-representation");
    representationElement.innerText =  `Représentation: ${item.representation}/5`
    const imageElement = document.querySelector(".item-image");
    imageElement.innerText =  `Image: ${item.image}/5`
    const materialiteElement = document.querySelector(".item-materialite");
    materialiteElement.innerText =  `Matérialité: ${item.materialite}/5`
    const processusElement = document.querySelector(".item-processus");
    processusElement.innerText = `Procéssus: ${item.processus}/5`
    const presentationElement = document.querySelector(".item-presentation");
    presentationElement.innerText =  `Présentation: ${item.presentation}/5`

    // Mise en place des boutons de modification et de suppression
    const itemValueInputs = document.querySelectorAll(".item-value");
    for (let i = 0; i < itemValueInputs.length; i++) {
        itemValueInputs[i].value = item.url;
    }

    const deleteForm = document.querySelector(".delete-form");
    deleteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        data = new FormData(deleteForm);
        response = await fetch("/delete", {
            method: "post",
            body: data
        });
        showMessage(response.status);
        if (response.status == 200) {
            location.href = "/catalogue";
        }
    }, false);
}




window.addEventListener("load", async () => {
    const jsonItem = await fetch(window.location.href + "/json");
    const item = await jsonItem.json();
    if (item == null) {
        createNoItemPage();
    }
    else {
        createItemPage(item);
    }
});