/**
 * This file handles the input check and handles the selected images
 * Used HTML Ids:
 * formAjax : form used for uploading
 * fileAjax : files in the uploading form
 * chosenImages : images chosen for memory generator
 */


window.addEventListener("load",function(){
    document.getElementById("fileAjax").addEventListener("change", changeUploadButton);
    //document.spelgenerator.addEventListener("submit",checkInput);
    //document.getElementById('formAjax').addEventListener("submit",addToFileListFromUpload);
});

function strcmp ( str1, str2 ) {
    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}

function changeUploadButton(){
    myFile = document.getElementById("fileAjax");
    var files = myFile.files;
    var amount = files.length;
    var statusP = document.getElementById('status');
    for(var i = 0; i < amount; i++){

        // Select file number i from files array
        var file = files[i];

        // Check the file type
        if (!file.type.match('image.*')) {
            statusP.innerHTML = 'Het geselecteerde bestand is geen afbeelding.';
            return;
        }else{
            let button = document.getElementById("choosebutton");
            button.innerHTML = amount + " bestand(en) geselecteerd"
        }
    }
}

/**
 * Adds a file to the selected list
 * @param {String} file string of file to be added to list
 */
function addFileToSelectedTable(file){

    let flag = false;
    for(let i = 0; i < selectedImages.length; i++){
        if(strcmp(selectedImages[i],file) == 0){
            flag = true;
        }
    }
    if(flag == true){
        return;
    }
    else{
        selectedImages.push(file);
        //serverImages.push(file);
        //serverImages.sort();
        //loadServerImagesFromIndex(selectedServerTable);
    }

    let begin = document.getElementById("chosenImages");

    //If the first element is a textNode remove it and append the selected files table
    if(begin.firstChild.nodeType == 3){
        begin.removeChild(begin.firstChild);
        let removeall = document.createElement("button");
        let table = document.createElement("table");
        table.id = "chosenImagesTable";
        removeall.className += "button-1";
        removeall.innerHTML = "Clear lijst";
        removeall.id = "clearButton";
        removeall.addEventListener("click",clearSelectedTable);
        begin.appendChild(removeall);
        begin.appendChild(table);
    }
    let table = document.getElementById("chosenImagesTable");
    let tr = document.createElement("tr");
    let td2 = document.createElement("td");
    let td = document.createElement("td");
    tr.appendChild(td2);
    td2.appendChild(document.createTextNode((Math.floor(id/2)).toString()));
    tr.appendChild(td);
    td.appendChild(document.createTextNode(file));
    tr.id = file;
    table.appendChild(tr);
    
    let hidden = document.getElementById("hiddenImages");
    let newImage = document.createElement("input");
    newImage.setAttribute("type", "hidden");
    newImage.setAttribute("value", file.name + ";" + (Math.floor(id/2)).toString());
    newImage.setAttribute("name", "image[" + id + "]");
    hidden.appendChild(newImage);
    id += 1;
}

function removeFileFromSelectedTable(file){
    let begin = document.getElementById("chosenImages");
    for(let i = 0; i < selectedImages.length; i++){
        if(selectedImages[i] == file){
            selectedImages.splice(i,1);
        }
    }

    let todelete = document.getElementById(file);
    let parent = todelete.parentNode;
    parent.removeChild(todelete);

    if(!parent.hasChildNodes()){
        parent.parentNode.removeChild(parent);
        button = document.getElementById("clearButton");
        button.parentNode.removeChild(button);
        begin.appendChild(document.createTextNode("Er zijn momenteel geen afbeeldingen gekozen."))
    }
}

function clearSelectedTable(){
    while(selectedImages.length != 0){
        removeFileFromSelectedTable(selectedImages[0]);
        unselectAllCheckmarks();
    }
}

function unselectAllCheckmarks(){
    var checks = document.querySelectorAll('.checkbox');
    for (var i = 0; i < checks.length; i++){
        checks[i].checked = false;
    }
}