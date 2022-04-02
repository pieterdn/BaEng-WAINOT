
window.addEventListener("load",function(){
    document.spelgenerator.addEventListener("submit",checkInput);
    document.getElementById('formAjax').addEventListener("submit",addToFileListFromUpload);
});


function addToFileListFromUpload(event){
    event.preventDefault();
    let myForm = document.getElementById('formAjax');
    let files = document.getElementById('fileAjax').files;
    console.log(files);
    for(let i = 0; i < files.length; i++){
        selectedImages[selectedImages.length + i] = files[i].name;
        addFileToSelectedTable(files[i].name)
    }
}


function addFileToSelectedTable(file){
    let begin = document.getElementById("chosenImages");
    // console.log(begin.firstChild);
    if(begin.firstChild.nodeType == 3){
        begin.removeChild(begin.firstChild);
        begin.appendChild(document.createElement("table"));
    }
    let table = begin.firstChild;
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    tr.appendChild(td);
    td.appendChild(document.createTextNode(file));
    table.appendChild(tr);
}


function checkInput(event){
    if(document.spelgenerator.width.value=='' || Number(document.spelgenerator.width.value)<0 ){
        event.preventDefault();
        window.alert("geen valide Breedte");
        document.spelgenerator.width.focus();
    }
    else if(document.spelgenerator.height.value=='' || Number(document.spelgenerator.height.value)<0){
        event.preventDefault();
        window.alert('geen valide Hoogte');
        document.spelgenerator.height.focus();
       
    }
    else if((Number(document.spelgenerator.width.value)*Number(document.spelgenerator.height.value))%2 == 1){
        event.preventDefault();
        window.alert('geen even aantal veltjes');
    }
}