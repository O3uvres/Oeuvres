function encodeMessage(message) {
  var y=document.createElement('span');
  y.innerHTML=message;
  return y.innerHTML;
}

function showMessage(status) {
  if (status == 200) {
    alert(encodeMessage("L'oeuvre a été ajoutée avec succès !"));
  } 
  else if (status == 400) {
    alert(encodeMessage("Requette incorrecte."));
  }
  else if (status == 417) {
    alert(encodeMessage("Aucune image n'a été sélectionnée."));
  }
  else if (status == 500) {
    alert(encodeMessage("Erreur lors de l'ajout de l'oeuvre."));
  }
}

async function sendModifications(e, form) {
  e.preventDefault();
  e.stopPropagation();
  formData = new FormData(form);
  file = Array.from(uploadButton.files)[0];
  formData.append('file', file);

  // const data = new URLSearchParams(formData);

  response = await fetch("/add", {
      method: 'post',
      body: formData,
  });
  showMessage(response.status);
  if (response.status == 200) {
    location.reload();
  }
}

let uploadButton;
window.addEventListener("DOMContentLoaded", (event) => {

    uploadButton = document.getElementById("upload-button");
    let chosenImage = document.getElementById("chosen-image");
    let fileName = document.getElementById("file-name");
    let container = document.getElementById("drag-and-drop-box")
    let error = document.getElementById("error");
    let imageDisplay = document.getElementById("image-display");
    
    const fileHandler = (file, name, type) => {
        if (type.split("/")[0] !== "image") {
          //File Type Error
          error.innerText = "Please upload an image file";
          return false;
        }
        error.innerText = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          let img = document.getElementById("image-display-image");
          let legend = document.getElementById("image-display-figcaption");
          let label = document.getElementById("upload-button-label");
          img.src = reader.result;
          legend.innerText = name;
          imageDisplay.style.backgroundColor = "white";
          label.innerText = "Changer l'image";
          container.style.height = "";
        };
    };
    
    //Upload Button
    uploadButton.addEventListener("change", () => {
        // imageDisplay.innerHTML = "";
        // Array.from(uploadButton.files).forEach((file) => {
        //   fileHandler(file, file.name, file.type);
        // });
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
        form = document.querySelector(".new-artwork-form");
        form.addEventListener("submit", (e) => sendModifications(e, form), false);
    };
});