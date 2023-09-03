function readParameters() {
  var parameters = location.search.substring(1).split("&"); // .substring(1) pour enlever le "?"
  let url_name = "";
  let result = "";
  for (let i = 0; i < parameters.length; i++) {
    let parameter = parameters[i].split("=");
    let pName = parameter[0]; // Car name il ne voulait pas
    let value = parameter[1];
    value = decodeURIComponent(decodeURIComponent(value));
    if (pName == "item") {
        url_name = decodeURI(value);
    }
    else if (pName = "result") {
        result = decodeURI(value);
    }
  }
  return [url_name, result]
}

function encodeMessage(message) {
  var y=document.createElement('span');
  y.innerHTML=message;
  return y.innerHTML;
}
function showMessage(status) {
  if (status == 200) {
    alert(encodeMessage("L'oeuvre a été mise à jour avec succès !"))
  } 
  else if (status == 500) {
    alert(encodeMessage("Erreur lors de la mise à jour de l'oeuvre."))
  }
}

function setImage(name, src) {
  let container = document.getElementById("drag-and-drop-box")
  let imageDisplay = document.getElementById("image-display");
  let img = document.getElementById("image-display-image");
  let legend = document.getElementById("image-display-figcaption");
  let label = document.getElementById("upload-button-label");


  img.src = src;
  legend.innerText = name;
  imageDisplay.style.backgroundColor = "white";
  label.innerText = "Changer l'image";
  container.style.height = "";
}

function loadItemNotFoundPage() {
    mainElt = document.getElementsByTagName("main")[0];
    mainElt.innerHTML = "";

    const error = document.createElement("h1");
    error.classList = ["error-message"];
    error.innerText = "Cette URL ne renvoie vers aucune oeuvre.";
    
    mainElt.appendChild(error);
}
function loadPage(item) {
  const itemInput = document.getElementById("item-input");
  itemInput.value = item.url;

  // let file = new File(item.src);
  // let files = new FileList(file);
  // uploadButton.files = files;
  // Array.from(files).forEach((file) => {
  //   fileHandler(file, file.name, file.type);
  // });
  // const uploadInput = document.getElementById("upload-button");
  // uploadInput.value = item.src;
  setImage(item.name, item.src);

  const nameInput = document.getElementById("name-input");
  nameInput.value = item.name;
  const authorInput = document.getElementById("author-input");
  authorInput.value = item.author;
  const materiauEtSupportInput = document.getElementById("materiau-et-support-input");
  materiauEtSupportInput.value = item["materiau et support"];
  const dimensionsInput = document.getElementById("dimensions-input");
  dimensionsInput.value = item.dimensions;
  const dateInput = document.getElementById("date-input");
  dateInput.value = item.date;
  const lieuDeConservationInput = document.getElementById("lieu-de-conservation-input");
  lieuDeConservationInput.value = item["lieu de conservation"];

  const representationInput = document.getElementById("representation-filter");
  representationInput.value = item.representation;
  const imageInput = document.getElementById("image-filter");
  imageInput.value = item.image;
  const materialiteInput = document.getElementById("materialite-filter");
  materialiteInput.value = item.materialite;
  const processusInput = document.getElementById("processus-filter");
  processusInput.value = item.processus;
  const presentationInput = document.getElementById("presentation-filter");
  presentationInput.value = item.presentation;
}

async function sendModifications(e, form, item) {
  e.preventDefault();
  e.stopPropagation();
  const data = new URLSearchParams(new FormData(form));

  response = await fetch("/edit", {
      method: 'post',
      body: data,
  });
  showMessage(response.status);
  if (response.status == 200) {
    location.href = "/oeuvres/" + item.url;
  }
}


window.addEventListener("load", async () => { 
  const [url_name, result] = readParameters();
  const jsonItem = await fetch("/oeuvres/" + url_name + "/json");
  const item = await jsonItem.json();
  if (item == null) {
    loadItemNotFoundPage();
  }
  else {
    loadPage(item);
  }
  form = document.querySelector(".new-artwork-form");
  form.addEventListener("submit", (e) => sendModifications(e, form, item), false);
});


window.addEventListener("DOMContentLoaded", (event) => {
  let uploadButton = document.getElementById("upload-button");
  let chosenImage = document.getElementById("chosen-image");
  let fileName = document.getElementById("file-name");
  let container = document.getElementById("drag-and-drop-box")
  let error = document.getElementById("error");

  const fileHandler = (file, name, type) => {
      if (type.split("/")[0] !== "image") {
        //File Type Error
        error.innerText = "Please upload an image file";
        return false;
      }
      error.innerText = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImage(name, reader.src);
  };

  //Upload Button
  uploadButton.addEventListener("change", () => {
      file = Array.from(uploadButton.files)[0];
      fileHandler(file, file.name, file.type);
  });

  container.addEventListener(
      "dragenter",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.add("active");
      },
      false
  );

  container.addEventListener(
      "dragleave",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.remove("active");
      },
      false
  );

  container.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.add("active");
      },
      false
  );

  container.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.remove("active");
        let draggedData = e.dataTransfer;
        let files = draggedData.files;
        uploadButton.files = files;
        Array.from(files).forEach((file) => {
          fileHandler(file, file.name, file.type);
        });
      },
      false
  );

  window.onload = () => {
      error.innerText = "";
      container.style.height = "100%";
  };
});