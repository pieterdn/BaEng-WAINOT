/**
 * This file handles the input check and handles the selected images
 * -----------------------------------------------------------------
 * USED HTML ID'S:
 * formAjax : form used for uploading
 * fileAjax : files in the uploading form
 * chosenImages : images chosen for memory generator
 * chosenImagesTable : table to show chosen images
 * hiddenImages : div in form that gets processed by generator.py, this contains
 *      the selected images
 * hiddenText : same as images, but for text when in text and image gametype
 * status : shows status of upload
 * choosebutton : informs user of how many files where selected on the button
 * imagePicker : id of fieldset that contains everything image-related
 * selImgTitle : title of table that shows the selected images
 * file + "checkbox" : checkbox id of a server image
 * uniek : radiobutton for unique gametype
 * paren : radiobutton for pairs gametype
 * text : radiobutton for text and image gametype
 * validation : hidden input in form that gets processed by generator.py. Used
 *      to block submit when it's not valid
 * selectedImages[i] + "?text" : id of textfield when in gametype text and image
 * selectedImages[i] + "?formText" : id of hidden input in form that gets processed
 *      by generator.py. Used in when gametype text and image is active.
 * validationMessage : message underneath 'genereer'-button. Shows what's wrong
 *      when the form is not valid.
 * clearButton : id of button that can clear the whole chosenImages array and
 *      chosenImagestable
 * 
 * USED HTML CLASSES:
 * button-1 : used in css to format buttons
 * imageText : used to format textfield when in text and image gametype
 */

let imagesNeeded = 0;
let textNeeded = 0;
var id = 0;
var subid = 0;
var valid;
var currentGametype = "paren";
var oldType;
var colorTable =    ["#33aa55", "#fe0037", "#250861", "#d95d2c", "#998055", "#9d43a5", 
                     "#a9bb70", "#ae788c", "#496100", "#fe0037", "#1a472a", "#c51f5d",
                     "#96ceb4", "#1a61b6", "#d32e97", "#9d43a5", "#ffa31a", "#8d3523"];

window.addEventListener("load",function(){
    calculateImagesNeeded(null);
    document.getElementById("fileAjax").addEventListener("change", changeUploadButton);
    document.spelgenerator.dimensions.addEventListener("change", calculateImagesNeeded);
    var gametype = document.getElementsByName("gametype")
    for(let i = 0; i < gametype.length; i++){
        gametype[i].addEventListener("change",calculateImagesNeeded);
    }
});

/**
 * String compare function that returns 0 when the two strings are equal.
 * @param {string} str1 
 * @param {string} str2 
 * @returns {-1|0|1}
 */
function strcmp ( str1, str2 ) {
    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}

/**
 * Changes the text in the upload button.
 */
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
 * Calculates the images needed for the current gametype and dimensions.
 * @param {Event} event 
 */
function calculateImagesNeeded(event){
    
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
                textNeeded = 0;
            }
            if(strcmp(checkedValue,"paren") == 0){
                currentGametype = "paren";
                imagesNeeded = tileAmount/2;
                textNeeded = 0;
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

    if(event != null){

        if(!((strcmp(oldType,"text") == 0) && (strcmp(currentGametype,"text") == 0))){
            if((strcmp(event.target.value,"text") == 0) || (strcmp(oldType,"text") == 0))
                clearSelectedTable();
        }

        if(!((strcmp(oldType,"uniek") == 0) && (strcmp(currentGametype,"uniek") == 0))){
            if((strcmp(event.target.value,"uniek") == 0) || (strcmp(oldType,"uniek") == 0))
                clearSelectedTable();
        }
    }
    oldType = currentGametype;
    checkValidity();
}

/**
 * Adds a file to the selected list.
 * @param {String} file String of file to be added to list.
 */
function addFileToSelectedTable(file){

    if(imagesNeeded == selectedImages.length){
        let toUncheck = document.getElementById(file + "checkbox");
        if(toUncheck != null)
            toUncheck.checked = false;
        return;
    }

    let flag = false;
    for(let i = 0; i < selectedImages.length; i++){
        if(strcmp(selectedImages[i],file) == 0)
            flag = true;
    }
    if(flag == true)
        return;
    else
        selectedImages.push(file);

    let begin = document.getElementById("chosenImages");

    //If the first element is a textNode remove it and append the selected files table and clear button
    if(begin.firstChild.nodeType == 3){
        begin.removeChild(begin.firstChild);
        let removeall = document.createElement("button");
        let table = document.createElement("table");
        table.id = "chosenImagesTable";
        removeall.className += "button-1 ";
        removeall.innerHTML = "Clear lijst";
        removeall.id = "clearButton";
        removeall.addEventListener("click",clearSelectedTable);
        begin.appendChild(removeall);
        begin.appendChild(table);
    }
    let table = document.getElementById("chosenImagesTable");
    let tr = table.insertRow(selectedImages.length-1);
    let td1 = document.createElement("td");
    let tddel = document.createElement("tddel");
    let removeone = document.createElement("span");
    tr.appendChild(tddel);
    tr.appendChild(td1);
    tr.id = file;
    td1.appendChild(document.createTextNode(file));
    tddel.appendChild(removeone);
    removeone.id = file + "?toremove";
    removeone.className += "close heavy rounded ";
    removeone.addEventListener("click", function(){
        removeFileFromSelectedTable(file);
        document.getElementById(file + "checkbox").checked = false;
    });

    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";
    
    let hidden = document.getElementById("hiddenImages");
    let newImage = document.createElement("input"); // <input type="hidden" name="image[x]" value="name;id">
    newImage.setAttribute("type", "hidden"); 
    if (document.getElementById("uniek").checked){
        newImage.setAttribute("value", file + "?" + (Math.floor(id/2)).toString());
        td1.style.color = colorTable[Math.floor(id/2)];
    }
    if (document.getElementById("paren").checked)
        newImage.setAttribute("value", file + "?" + id);
    if (document.getElementById("text").checked)
        newImage.setAttribute("value", file + "?" + id);
    newImage.setAttribute("name", "image" + id);
    hidden.appendChild(newImage);

    if(textNeeded == 0)
        id += 1;

    if(textNeeded != 0){
        let td2 = document.createElement("td");
        let input = document.createElement("input");
        input.type = "text";
        input.className += "imageText ";
        input.id = file + "?text";
        input.addEventListener("change", checkValidity);
        tr.appendChild(td2);
        td2.appendChild(input);

        let hiddenText = document.getElementById("hiddenText");
        let newText = document.createElement("input");
        newText.setAttribute("type", "hidden");
        newText.setAttribute("name", newImage.value.split('?')[0] + "?formText");
        newText.setAttribute("id", newImage.value.split('?')[0] + "?formText");
        hiddenText.appendChild(newText);
        id += 1;
    }
    checkValidity();
}

/**
 * Checks wether the current selected images and/or textfields and title are
 * selected and/or not empty.
 * Changes the validity of the hidden input with id "validation".
 * NOTE: the customValidity of this hidden input is changed, but the actual
 * customValidity is never shown because it's hidden.
 * Therefore the div with id "validationMessag" is used.
 * @param {Event} event  
 */
function checkValidity(event){
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
                let id = selectedImages[i] + "?text";
                let textfield = document.getElementById(id);
                if(textfield.value == ""){
                    textfield.setCustomValidity("Tekstveld niet ingevuld");
                    document.getElementById("validation").setCustomValidity("Niet alle tekstvelden ingevuld");
                    valid = false;
                    return;
                }
                else{
                    document.getElementById("validation").setCustomValidity("");
                    let textId = selectedImages[i] + "?formText";
                    let outputText = document.getElementById(textId);
                    outputText.value = textfield.value;
                    valid = true;
                }
            }
        }
    }
}

/**
 * Function that changes the text within the div with id "validationMessage",
 * depending on the state of the boolean 'valid'.
 */
function validOrNot(){
    if(valid == false){
        if(strcmp(currentGametype, "text") == 0){
            for(let i = 0; i < selectedImages.length; i++){
                let id = selectedImages[i] + "?text";
                let textfield = document.getElementById(id);
                if(textfield.value == "")
                    textfield.reportValidity();
            }   
        } 
        let div = document.getElementById("validationMessage");
        div.innerHTML = "Onvoldoende afbeeldingen geselecteerd of niet alle tekstvelden ingevuld.";
    }
}

/**
 * Removes an image from the selectedImages array and the chosenImages table.
 * @param {string} file String of the filename that needs to be removed from the
 *      selectedImages array and the chosenImages table.
 */
function removeFileFromSelectedTable(file){
    let begin = document.getElementById("chosenImages");
    for(let i = 0; i < selectedImages.length; i++){
        if(selectedImages[i] == file)
            selectedImages.splice(i,1);
    }

    let todelete = document.getElementById(file);
    let parent = todelete.parentNode;
    parent.removeChild(todelete);

    if(!parent.hasChildNodes()){
        parent.parentNode.removeChild(parent);
        button = document.getElementById("clearButton");
        button.parentNode.removeChild(button);
        document.getElementById("chosenImagesTable").parentNode.removeChild(document.getElementById("chosenImagesTable"));
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
            if (strcmp(oldType, "text") == 0){
                let divText = document.getElementById("hiddenText");
                divText.removeChild(divText.children[i]);
            }
            break;
        }
    }

    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";
    checkValidity();
}

/**
 * Clears the selecedImages array and the chosenImages table.
 */
function clearSelectedTable(){
    while(selectedImages.length != 0){
        removeFileFromSelectedTable(selectedImages[0]);
        unselectAllCheckmarks();
    }
}

/**
 * Unselects all the checkmarks of the serverImgTable.
 */
function unselectAllCheckmarks(){
    var checks = document.querySelectorAll('.checkbox');
    for (var i = 0; i < checks.length; i++){
        checks[i].checked = false;
    }
}