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
 * nothingSelectedMessage : id of message when no image is selected
 * clearButtonDiv : id of div that contains the clearButton
 * clearButton : id of button that can clear the whole chosenImages array and
 *      chosenImagestable
 * "citrowid?" + i : rowid of the rows in chosenImagesTable
 * "pair?" + i : id of the radiobuttons when in uniek mode
 * file + "?toremove" : id of the cross before a file in the chosenImagesTable
 * 
 * USED HTML CLASSES:
 * button-1 : used in css to format buttons
 * imageText : used to format textfield when in text and image gametype
 */

let previousImagesNeeded;
let imagesNeeded = 0;
let textNeeded = 0;
var RemakeArray;
var id = 0;
var subid = 0;
var valid;
var currentPair = 0;
var amountPerPair = [];
var pairAmount;
var imageNamesWithNumbers = [];
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
 * Called by changing the dimension, gametype or pressing the clear button.
 * @param {Event} event 
 */
function calculateImagesNeeded(event){
    
    RemakeArray = false;
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

            if((selectedImages.length > imagesNeeded) && (strcmp(oldType, "uniek") != 0)){
                RemakeArray = true;
                clearSelectedTable();
            }
        }
    }

    if(event != null){

        if(strcmp(event.target.name, "dimensions") == 0){
            if(imagesNeeded > previousImagesNeeded){
                for(let i = 0; i < (imagesNeeded - previousImagesNeeded); i++){
                    imageNamesWithNumbers[(previousImagesNeeded + i)-selectedImages.length] = "image?" + (previousImagesNeeded +i);
                }
            }
            else
                RemakeArray = true;
        }

        if((strcmp(oldType, "uniek") == 0) && (strcmp(currentGametype, "uniek") != 0) && (strcmp(event.target.value, "clear") != 0)){
            RemakeArray = true;
            clearSelectedTableAfterUnique();
        }

        if((strcmp(oldType, "uniek") != 0) && (strcmp(currentGametype, "uniek") == 0) && (strcmp(event.target.value, "clear") != 0)){
            RemakeArray = true;
            clearSelectedTable();
            createPairButtons();
        }

        if((strcmp(currentGametype, "uniek") == 0) && (strcmp(oldType, "uniek") == 0) && (strcmp(event.target.value, "clear") != 0)){
            clearSelectedTable();
            document.getElementById("chosenImagesTable").parentNode.removeChild(document.getElementById("chosenImagesTable"));
            createPairButtons();
        }

        if((strcmp(oldType, "paren") == 0) && (strcmp(currentGametype, "text") == 0) && (strcmp(event.target.value, "clear") != 0)){
            RemakeArray = true;
            clearSelectedTable();
        }

        if((strcmp(oldType, "text") == 0) && (strcmp(currentGametype, "paren") == 0) && (strcmp(event.target.value, "clear") != 0)){
            RemakeArray = true;
            clearSelectedTable();
        }

        if((strcmp(currentGametype, "uniek") == 0) && (strcmp(event.target.value, "clear") == 0)){
            RemakeArray = true;
            clearSelectedTable();
        }

        if((strcmp(currentGametype, "paren") == 0) && (strcmp(event.target.value, "clear") == 0)){
            RemakeArray = true;
            clearSelectedTable();
        }

        if((strcmp(currentGametype, "text") == 0) && (strcmp(event.target.value, "clear") == 0)){
            RemakeArray = true;
            clearSelectedTable();
        }
    }
    else
        RemakeArray = true;
    if(RemakeArray == true){
        imageNamesWithNumbers = [];
        for(let i = 0; i < imagesNeeded; i++)
            imageNamesWithNumbers[i] = "image?" + i;
    }
    oldType = currentGametype;
    previousImagesNeeded = imagesNeeded;
    checkValidity();
}

/**
 * Function that creates the radiobuttons when in gametype 'uniek'.
 */
function createPairButtons(){

    let begin = document.getElementById("chosenImages");
    let table = document.createElement("table");
    pairAmount = imagesNeeded/2;
    table.id = "chosenImagesTable";
    begin.appendChild(table);

    for(let i = 0; i < pairAmount; i++){
        amountPerPair[i] = 0;
        let label = document.createElement("label");
        let input = document.createElement("input");
        let span = document.createElement("span");
        let radiolabel = document.createElement("label");
        let cel1 = document.createElement("td");
        let cel2 = document.createElement("td");

        newrow = table.insertRow(i);
        newrow.id = "citrowid?" + i;
        newrow.appendChild(cel1);
        newrow.appendChild(cel2);
        cel2.appendChild(label);
        cel1.appendChild(radiolabel);
        label.className += "radiocontainer2 ";
        label.appendChild(input);
        label.appendChild(span);
        radiolabel.appendChild(document.createTextNode("Paar " + (i+1)));
        radiolabel.className += "pairLabel ";
        span.className += "radiomark2 ";
        input.type = "radio";
        input.name = "selectedpair";
        input.value = i;
        input.id = "pair?" + i;
        //Changes the currentPair value when changing radiobutton.
        input.addEventListener("change", function(){
            let radioButtons = document.getElementsByName("selectedpair");
            for(let i = 0; i < radioButtons.length; i++){
                if(radioButtons[i].checked)
                    currentPair = radioButtons[i].value;
            }
        });
    }
    document.getElementById("pair?0").checked = true;
    currentPair = 0;
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
    else if(strcmp(currentGametype, "uniek") == 0){
        addFileWhenUnique(file);
        checkValidity();
        return;
    }else
        selectedImages.push(file);
    
    let begin = document.getElementById("chosenImages");

    document.getElementById("nothingSelectedMessage").innerHTML = "";

    if((document.getElementById("chosenImagesTable")) == null){
        let table = document.createElement("table");
        table.id = "chosenImagesTable";
        begin.appendChild(table);
    }
    
    if(document.getElementById("clearButton") == null){
        let cleardiv = document.getElementById("clearButtonDiv");
        let removeall = document.createElement("button");
        removeall.className += "button-1 ";
        removeall.innerHTML = "Clear lijst";
        removeall.id = "clearButton";
        removeall.value = "clear";
        removeall.addEventListener("click",calculateImagesNeeded);
        cleardiv.appendChild(removeall);
    }

    let table = document.getElementById("chosenImagesTable");
    let tr = table.insertRow(selectedImages.length-1);
    let td1 = document.createElement("td");
    let tddel = document.createElement("td");
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
        if(document.getElementById(file + "checkbox") != null)
            document.getElementById(file + "checkbox").checked = false;
    });

    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";
    
    let hidden = document.getElementById("hiddenImages");
    let newImage = document.createElement("input"); // <input type="hidden" name="image[x]" value="name;id">
    newImage.setAttribute("type", "hidden"); 
    let idFromName = imageNamesWithNumbers[0].split('?')[1];
    if (document.getElementById("paren").checked){
        newImage.setAttribute("value", file + "?" + idFromName);
        newImage.id = file + "?" + idFromName;
    }
    if (document.getElementById("text").checked){
        newImage.setAttribute("value", file + "?" + idFromName);
        newImage.id = file + "?" + idFromName;
    }
    newImage.setAttribute("name", imageNamesWithNumbers[0]);
    hidden.appendChild(newImage);
    imageNamesWithNumbers.splice(newImage.name, 1);

    if(textNeeded == 0)
        id += 1;

    if(textNeeded != 0){
        let td2 = document.createElement("td");
        let input = document.createElement("input");
        input.type = "text";
        input.className += "imageText ";
        input.id = file + "?text";
        input.addEventListener("change", checkValidity);
        input.addEventListener("change", refreshPreviewImages);
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
 * Adds a file to the selected list, specifically when gametype 'uniek' is
 * selected.
 * @param {String} file String of file to be added
 */
function addFileWhenUnique(file){

    if(amountPerPair[currentPair] == 2){
        let toUncheck = document.getElementById(file + "checkbox");
        if(toUncheck != null)
            toUncheck.checked = false;
        return;
    }
    else
        selectedImages.push(file);

    document.getElementById("nothingSelectedMessage").innerHTML = "";
    
    if(document.getElementById("clearButton") == null){
        let cleardiv = document.getElementById("clearButtonDiv");
        let removeall = document.createElement("button");
        removeall.className += "button-1 ";
        removeall.innerHTML = "Clear lijst";
        removeall.id = "clearButton";
        removeall.value = "clear";
        removeall.addEventListener("click",calculateImagesNeeded);
        cleardiv.appendChild(removeall);
    }

    let td1 = document.createElement("td");
    let tddel = document.createElement("td");
    let removeone = document.createElement("span");
    let tr = document.getElementById("citrowid?" + currentPair);
    tr.appendChild(tddel);
    tr.appendChild(td1);
    td1.appendChild(document.createTextNode(file));
    td1.id = currentPair + "?td1?" + file;
    tddel.appendChild(removeone);
    tddel.id = currentPair + "?td2?" + file;
    tddel.className += "tddel ";
    removeone.id = file + "?toremove";
    removeone.className += "close heavy rounded ";
    removeone.addEventListener("click", function(){
        removeFileFromSelectedTable(file);
        document.getElementById(file + "checkbox").checked = false;
    });

    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";
    
    let hidden = document.getElementById("hiddenImages");
    let newImage = document.createElement("input");
    newImage.setAttribute("type", "hidden");
    newImage.setAttribute("value", file + "?" + currentPair);
    newImage.id = file + "?" + currentPair;
    newImage.setAttribute("name", imageNamesWithNumbers[0]);
    hidden.appendChild(newImage);

    imageNamesWithNumbers.splice(newImage.name, 1);
    amountPerPair[currentPair] += 1;
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
    
    for(let i = 0; i < selectedImages.length; i++){
        if(selectedImages[i] == file)
            selectedImages.splice(i,1);
    }

    if((strcmp(currentGametype, "uniek") == 0) && (strcmp(oldType, "uniek") == 0)){
        checkValidity();
        removeFileWhenUnique(file);
        return;
    }

    let nameToRecover;
    for(let j = 0; j <= imagesNeeded; j++){
        if(document.getElementById(file + "?" + j) != null){
            let toRecover = document.getElementById(file + "?" + j);
            nameToRecover = toRecover.name;
        }
    }

    imageNamesWithNumbers.push(nameToRecover);

    let table = document.getElementById("chosenImagesTable");
    let todelete = document.getElementById(file);
    let parent = todelete.parentNode;
    parent.removeChild(todelete);

    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";

    if(table.rows.length == 0){
        button = document.getElementById("clearButton");
        button.parentNode.removeChild(button);
        document.getElementById("chosenImagesTable").parentNode.removeChild(document.getElementById("chosenImagesTable"));
        document.getElementById("nothingSelectedMessage").innerHTML = "Er zijn momenteel geen afbeeldingen gekozen.";
        // document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
        //         + selectedImages.length + "/" + imagesNeeded + ")";
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
    checkValidity();
}

/**
 * Removes an image from the selectedImages array and the chosenImages table,
 * specifically when gametype 'uniek' is active.
 * @param {String} file String of the filename that needs to be removed from the
 *      selectedImages array and the chosenImages table.
 */
function removeFileWhenUnique(file){
    let fileBelongsTo;
    for(let i = 0; i < pairAmount; i++){
        for(let j = 0; j < amountPerPair[i]; j++){
            if(document.getElementById(i + "?td1?" + file) != null)
                fileBelongsTo = i;
        }
    }

    let todelete1 = document.getElementById(fileBelongsTo + "?td1?" + file);
    let todelete2 = document.getElementById(fileBelongsTo + "?td2?" + file);
    todelete1.parentNode.removeChild(todelete1);
    todelete2.parentNode.removeChild(todelete2);

    let hidden = document.getElementById("hiddenImages");
    let toremove = document.getElementById(file + "?" + fileBelongsTo);
    let nameToRecover = toremove.name;
    imageNamesWithNumbers.push(nameToRecover);
    hidden.removeChild(toremove);
    amountPerPair[fileBelongsTo] -= 1;

    let radiob = document.getElementById("pair?" + fileBelongsTo);
    radiob.checked = true;
    currentPair = fileBelongsTo;

    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
                + selectedImages.length + "/" + imagesNeeded + ")";

    if(selectedImages.length == 0){
        button = document.getElementById("clearButton");
        button.parentNode.removeChild(button);
        document.getElementById("nothingSelectedMessage").innerHTML = "Er zijn momenteel geen afbeeldingen gekozen.";
        // document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
        //         + selectedImages.length + "/" + imagesNeeded + ")";
    }
}

/**
 * Clears the selecedImages array and the chosenImages table.
 */
function clearSelectedTable(){
    while(selectedImages.length != 0){
        removeFileFromSelectedTable(selectedImages[0]);
        unselectAllCheckmarks();
    }
    refreshPreviewImages();
}

/**
 * Clears the selectedImages array and the chosenImages table after the gametype
 * 'uniek' was active.
 */
function clearSelectedTableAfterUnique(){
    while(selectedImages.length != 0){
        for(let i = 0; i < selectedImages.length; i++){
            if(selectedImages[i] == selectedImages[0])
                selectedImages.splice(i,1);
        }
    }
    document.getElementById("chosenImagesTable").parentNode.removeChild(document.getElementById("chosenImagesTable"));
    document.getElementById("selImgTitle").innerHTML = "Geselecteerde afbeeldingen ("
        + selectedImages.length + "/" + imagesNeeded + ")";
    document.getElementById("nothingSelectedMessage").innerHTML = "Er zijn momenteel geen afbeeldingen gekozen.";
    button = document.getElementById("clearButton");
    if(button != null)
        button.parentNode.removeChild(button);
    let hidden = document.getElementById("hiddenImages");
    while(hidden.firstChild != null){
        hidden.removeChild(hidden.firstChild);
    }
    unselectAllCheckmarks();
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