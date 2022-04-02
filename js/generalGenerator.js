/**
 * This file handles the input check and handles the selected images
 * Used HTML Ids:
 * formAjax : form used for uploading
 * fileAjax : files in the uploading form
 * chosenImages : images chosen for memory generator
 */


window.addEventListener("load",function(){
    document.spelgenerator.addEventListener("submit",checkInput);
    document.getElementById('formAjax').addEventListener("submit",addToFileListFromUpload);
});

/**
 * Adds uploaded files to the selected list
 * @param {Event} event submit event from a form
 */
function addToFileListFromUpload(event){
    //Stay on the same page
    event.preventDefault();
    let files = document.getElementById('fileAjax').files;
    //Add all uploaded files to the selected files list
    for(let i = 0; i < files.length; i++){
        addFileToSelectedTable(files[i].name)
    }
}

/**
 * Adds a file to the selected list
 * @param {String} file string of file to be added to list
 */
function addFileToSelectedTable(file){
    selectedImages.push(file);
    serverImages.push(file);
    serverImages.sort();
    loadServerImagesFromIndex(selectedServerTable);
    let begin = document.getElementById("chosenImages");

    //If the first element is a textNode remove it and append the selected files table
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

/**
 * Check to see that the input is valid.
 * Valid input: width and height are both integers and their product is even.
 * @param {Event} event submit event from a form
 */
function checkInput(event){
    if(document.spelgenerator.width.value =='' || Number(document.spelgenerator.width.value)<0 ){
        event.preventDefault();
        window.alert("geen valide Breedte");
        document.spelgenerator.width.focus();
    }
    else if(document.spelgenerator.height.value =='' || Number(document.spelgenerator.height.value)<0){
        event.preventDefault();
        window.alert('geen valide Hoogte');
        document.spelgenerator.height.focus();
    }
    else if((Number(document.spelgenerator.width.value)*Number(document.spelgenerator.height.value))%2 == 1){
        event.preventDefault();
        window.alert('geen even aantal veltjes');
    }
}