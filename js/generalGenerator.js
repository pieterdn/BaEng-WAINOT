/**
 * This file handles the input check and handles the selected images
 * Used HTML Ids:
 * formAjax : form used for uploading
 * fileAjax : files in the uploading form
 * chosenImages : images chosen for memory generator
 */

let imagesNeeded = 0;
let textNeeded = 0;
var id = 0;
var subid = 0;
var valid;
var currentGametype = "paren";

window.addEventListener("load",function(){
    calculateImagesNeeded(null);
    document.getElementById("fileAjax").addEventListener("change", changeUploadButton);
    document.spelgenerator.dimensions.addEventListener("change", calculateImagesNeeded);
    var gametype = document.getElementsByName("gametype")
    for(let i = 0; i < gametype.length; i++){
        gametype[i].addEventListener("change",calculateImagesNeeded);
        //gametype[i].addEventListener("change",clearSelectedTable);
    }
    
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

function calculateImagesNeeded(event){
    
    if(event != null){
        if(strcmp(event.target.value,"text") == 0){
            clearSelectedTable();
        }
        console.log(event.target);
    }
    
    let oldType = currentGametype;

    if(strcmp(oldType,"text") == 0){
        clearSelectedTable();
    }

    //let oldAmount = imagesNeeded
    let radioButtons = document.getElementsByName("gametype");
    for(let i = 0; i < radioButtons.length; i++){
        if(radioButtons[i].checked){
            document.getElementById("imagePicker").style.display = "block";
            let dimensions = document.spelgenerator.dimensions.value;
            const dimvalues = dimensions.split("x");
            let width = dimvalues[0];
            let height = dimvalues[1];
            let tileAmount = width * height;
            let checkedValue = radioButtons[i].value;

            if(strcmp(checkedValue,"uniek") == 0){
                currentGametype = "uniek";
                imagesNeeded = tileAmount;
            }
            if(strcmp(checkedValue,"paren") == 0){
                currentGametype = "paren";
                imagesNeeded = tileAmount/2;
            }
            if(strcmp(checkedValue,"text") == 0){
                currentGametype = "text";
                imagesNeeded = tileAmount/2;
                textNeeded = imagesNeeded;
            }

            document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";

            if(selectedImages.length > imagesNeeded)
                clearSelectedTable();
        }
    }
    checkValidity();
}

/**
 * Adds a file to the selected list
 * @param {String} file string of file to be added to list
 */
function addFileToSelectedTable(file){

    if(imagesNeeded == selectedImages.length){
        let toUncheck = document.getElementById(file + "checkbox");
        if(toUncheck != null){
            toUncheck.checked = false;
        }
        
        return;
    }

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

    //If the first element is a textNode remove it and append the selected files table and clear button
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
    
    let hidden = document.getElementById("hiddenImages");
    let newImage = document.createElement("input"); // <input type="hidden" name="image[x]" value="name;id">
    newImage.setAttribute("type", "hidden"); 
    newImage.setAttribute("value", file + "?" + (Math.floor(id/2)).toString()); 
    newImage.setAttribute("name", "image" + id);
    hidden.appendChild(newImage);
    id += 1;
    let table = document.getElementById("chosenImagesTable");
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    tr.appendChild(td1);
    td1.appendChild(document.createTextNode(file));
    tr.id = file;
    table.appendChild(tr);
    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";

    if(textNeeded != 0){
        let td2 = document.createElement("td");
        let input = document.createElement("input");
        input.type = "text";
        input.className += "imageText ";
        input.id = file + "text";
        input.addEventListener("change", checkValidity);
        tr.appendChild(td2);
        td2.appendChild(input);
    }
    checkValidity();
}

function checkValidity(){
    if(textNeeded == 0){
        if(imagesNeeded == selectedImages.length){
            document.getElementById("validation").setCustomValidity("");
            valid = true;
        }
        else{
            document.getElementById("validation").setCustomValidity("Niet genoeg afbeeldingen geselecteerd");
            valid = false;
        }
    }
    else{
        if(imagesNeeded != selectedImages.length){
            document.getElementById("validation").setCustomValidity("Niet genoeg afbeeldingen geselecteerd");
            valid = false;
        }
        else{
            for(let i = 0; i < imagesNeeded; i++){
                let id = selectedImages[i] + "text";
                let textfield = document.getElementById(id);
                if(textfield.value == ""){
                    textfield.setCustomValidity("Tekstveld niet ingevuld");
                    document.getElementById("validation").setCustomValidity("Niet alle tekstvelden ingevuld");
                    valid = false;
                    return;
                }
                else{
                    document.getElementById("validation").setCustomValidity("");
                    valid = true;
                }
            }
        }
    }
}

function validOrNot(){
    console.log("ValidOrNot");
    if(valid == false){
        for(let i = 0; i < imagesNeeded; i++){
            let id = selectedImages[i] + "text";
            let textfield = document.getElementById(id);
            if(textfield.value == ""){
                textfield.reportValidity();
            }
        }    
        let div = document.getElementById("validationMessage");
        div.innerHTML = "Onvoldoende afbeeldingen geselecteerd of niet alle tekstvelden ingevuld.";
    }
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
        document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";
    }
    let div = document.getElementById("hiddenImages");
    let l = div.children.length;
    for (let i = 0; i < l; i++)
    {
        if (file == div.children[i].value.split('?')[0])
        {
            div.removeChild(div.children[i]);
            id -= 1;
            break;
        }
    }
    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";
    checkValidity();
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