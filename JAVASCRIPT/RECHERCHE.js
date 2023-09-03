function effectuerRecherche() {
    const searchedValue = searchBar.value;
    var urlRecherche = "catalogue.html?search=" + encodeURIComponent(searchedValue);
    window.location.href = urlRecherche;
}

const searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("change", effectuerRecherche);
const loupe = document.querySelector(".loupe-image");
loupe.addEventListener("click", effectuerRecherche);
