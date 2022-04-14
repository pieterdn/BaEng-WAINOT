/**
 * This file handles the table that displays the images in de media folder on the server.
 * --------------------------------------------------------------------------------------
 * USED HTML ID'S:
 * allImages : parent div of serverImgTable
 * imgTableTitle : title of serverImgTable
 * nothingOnServer : div that only contains text when there's zero images on server
 * serverImgTable : table of images on server in the media folder
 * prevServerImg : navigation button for serverImgTable
 * nextServerImg : navigation button for serverImgTable
 * serverImage : the displayed server image
 * serverImages[i] + "x" : td id of a server image
 * serverImages[i] + "checkbox" : checkbox id of a server image
 * rowid + j.toString() : id of rows in serverImgTable (excluded arrowrow)
 * arrowrow: id of row that has the arrows
 * 
 * USED HTML CLASSES:
 * arrow : class used in css to create arrow
 * arrow_last : class used in css to communicate with user that last page has been reached
 * arrowLeft : class used in css to format left arrow
 * arrow_right : class used in css to format right arrow
 * checkbox : class used in css to format checkbox
 * checkcontainer : class used in css to format checkbox
 * checklabel : class used in css to format label for imagename next to checkbox
 * checkmark : class used in css to format checkbox
 * serverImgEntry : class used in css and js
 * selectedServerEntry : class used in css and js
 * white_arrow : class used in css to format both arrows
 */
var selectedImages = [];
var selectedServerTable = 0;
var tableAmount;
var arrows = false;
const maxServerTableHeight = 5;
const maxServerTableWidth = 2;

/**Helper class for keeping track of selected image */
class ServerImage{
    /**
     * Sets the element to null and text to "".
     */
    constructor(){
        this.innerElement = null;
        this.text = "";
    }

    /**
     * This setter sets the element to newEl and the text to the innerText of this element
     * @param {Element} newEl
     */
    set element(newEl){
        this.innerElement = newEl;
        this.text = newEl.innerText;
    }

    /**
     * @returns {Element} Returns the Element
     */
    get element(){
        return this.innerElement;
    }
}

var selectedServerImage = new ServerImage();

//ServerImgTable created after loading page.
window.addEventListener("load",function(){
    createServerImgTable();
});

/**
 * Should only be called after the page has loaded.
 * Creates the server image table.
 * Requires var serverImages: an array of strings of the files on the server in 
 * the media folder.
 */
function createServerImgTable(){

    let div = document.getElementById("allImages");
    let table = document.createElement("table");
    div.appendChild(table);
    table.setAttribute("id","serverImgTable");

    //When there's no images on server.
    if(serverImages.length == 0){
        let title = document.getElementById("imgTableTitle");
        let subtext = document.getElementById("nothingOnServer");
        title.innerHTML = "Afbeeldingen beschikbaar op server";
        subtext.innerHTML = "Er staan momenteel geen afbeeldingen op de server.";
        tableAmount = 0;
        return;
    }
    
    document.getElementById("imgTableTitle").innerHTML = "Afbeeldingen beschikbaar op server (" + serverImages.length + ")";

    //If there are more server images than the max table height times width, arrow keys are generated to navigate.
    tableAmount = serverImages.length;
    if(tableAmount > maxServerTableHeight*maxServerTableWidth){
        tableAmount = maxServerTableHeight*maxServerTableWidth;
        arrows = true;
        createArrows(table);
    }

    addServerImageToTable(0, tableAmount - 1, true);
}

/**
 * Called when the amount of images exceeds the maximum table amount.
 * @param {HTMLObjectElement} table Table where the arrows need to be added.
 */
function createArrows(table){

    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let tr = table.insertRow(0);
    let arrowLeft = document.createElement("div");
    let arrowRight = document.createElement("div");
    let spanLeft = document.createElement("span");
    let spanRight = document.createElement("span");

    td1.addEventListener("click",previousServerImages);
    td1.setAttribute("style","text-align:center;");
    td1.appendChild(arrowLeft);
    td2.addEventListener("click",nextServerImages);
    td2.setAttribute("style","text-align:center;");
    td2.appendChild(arrowRight);
    tr.id = "arrowrow";
    tr.appendChild(td1);
    tr.appendChild(td2);
    arrowLeft.classList.add("arrow");
    arrowLeft.classList.add("arrow_last");
    arrowLeft.setAttribute("id","prevServerImg");
    arrowLeft.appendChild(spanLeft);
    arrowRight.classList.add("arrow");
    arrowRight.setAttribute("id","nextServerImg");
    arrowRight.appendChild(spanRight);
    spanLeft.className += "white_arrow ";
    spanLeft.className += "arrow_left ";
    spanRight.className += "white_arrow ";
    spanRight.className += "arrow_right ";
}

/**
 * Goes to next 'page' of server images
 */
function nextServerImages(){

    let max = serverImages.length/(maxServerTableHeight * maxServerTableWidth);
    if(selectedServerTable + 1 >= max)
        return;
    if(selectedServerTable == 0)
        document.getElementById("prevServerImg").classList.remove("arrow_last");
    loadServerImagesFromIndex(++selectedServerTable,1);
    if(selectedServerTable + 1 >= max)
        document.getElementById("nextServerImg").classList.add("arrow_last");
}

/**
 * Goes to previous 'page' of server images
 */
function previousServerImages(){
    
    if(selectedServerTable == 0)
        return;
    let max = serverImages.length/(maxServerTableHeight * maxServerTableWidth);
    if(selectedServerTable + 1 >= max)
        document.getElementById("nextServerImg").classList.remove("arrow_last");
    loadServerImagesFromIndex(--selectedServerTable,-1);
    if(selectedServerTable == 0)
        document.getElementById("prevServerImg").classList.add("arrow_last");
}

/**
 * Changes the innerText of tds in the table to the specified 'page'
 * @param {int} page Current page, being 0 or higher.
 * @param {-1|0|1} direction What the next page should be. Respectively: previous,
 *      current or next.
 * @param {int} previousLength Previous amount of images on current page, 
 *      being 0 to the maximum amount on 1 page.
 */
function loadServerImagesFromIndex(page, direction, previousLength){
    
    let paststart;
    let pastend;
    let start;
    let end;

    //When next page is next page.
    if(direction == 1) {
        paststart = (page-1)*(maxServerTableHeight * maxServerTableWidth);
        pastend = (page*(maxServerTableHeight * maxServerTableWidth)) - 1;
        start = page*(maxServerTableHeight * maxServerTableWidth);
        let maxend = start + (maxServerTableHeight * maxServerTableWidth);
        if(serverImages.length > maxend)
            end = maxend-1;
        else
            end = serverImages.length-1;
    }
    //When next page is previous page.
    else if (direction == -1) {
        paststart = (page+1)*(maxServerTableHeight * maxServerTableWidth);
        let maxend = paststart + (maxServerTableHeight *maxServerTableWidth);
        if(serverImages.length > maxend)
            pastend = maxend -1;
        else
            pastend = serverImages.length -1;
        start = page*(maxServerTableHeight * maxServerTableWidth);
        end = start + (maxServerTableHeight * maxServerTableWidth) -1;
    }
    //When next page is current page.
    else if (direction == 0){
        pastend = previousLength-1;
        start = page*(maxServerTableHeight * maxServerTableWidth);
        let maxend = start + (maxServerTableHeight * maxServerTableWidth);
        if(serverImages.length > maxend)
            end = maxend - 1;
        else
            end = serverImages.length - 1;
        paststart = start;
    }

    for (let i = paststart; i <= pastend; i++) {
        let toremove = document.getElementById(serverImages[i] + ("x"));
        toremove.parentNode.removeChild(toremove);
    }

    addServerImageToTable(start, end, false);

    tableAmount = (end - start) + 1;
    document.getElementById("imgTableTitle").innerHTML = "Afbeeldingen beschikbaar op server (" + serverImages.length + ")";
    document.getElementById("nothingOnServer").innerHTML = "";
}

/**
 * Displays the clicked serverImgEntry if the innerText does not equal ""
 * @param {Event} event Click event on a serverImgEntry.
 */
function displayServerImage(event){

    if(event.target.textContent == "")
        return;

    let selected = document.getElementsByClassName("selectedServerEntry");
    for(let i = 0; i < selected.length; i++){
        selected[i].classList.remove("selectedServerEntry");
    }

    event.target.classList.add("selectedServerEntry");
    selectedServerImage.element = event.target;
    let servImg = document.getElementById("serverImage");
    let img = document.createElement("img");

    //Make the image have certain bounds
    let maxWidth = "200px";
    let maxHeight = "200px"
    img.onload = function(){
        if(img.naturalWidth>img.naturalHeight)
            img.setAttribute("style","width:" + maxWidth + ";margin:3px;");
        else
            img.setAttribute("style","height:" + maxHeight + ";margin:3px;");
        while(!img.complete);
        if(servImg.firstChild != null)
            servImg.removeChild(servImg.firstChild);
        servImg.appendChild(img);
    }
    img.setAttribute("src","./media/" + event.target.textContent);
    img.className += "zoom ";
}

/**
 * Checks wether or not the file that the user wants to upload is already
 * on the server.
 * @param {String} filename 
 * @returns {boolean}
 */
function checkFileOnServer(filename){

    for (var j = 0; j < serverImages.length; j++){
        if((strcmp(serverImages[j],filename.toString())) == 0)
            return true;
    }
    return false;
}

/**
 * Adds an image to the server through upload or Pixabay.
 * This function is called by imageUpload.js and pixabay-widget.js
 * @param {(Array.<file> | Array.<filename>)} files Filearray or filenamearray,
 *      depending on the type respectively.
 * @param {1|2} type Type 1 when upload from computer, type 2 when from Pixabay.
 */
function addServerImage(files,type){

    let amountAdded = files.length;
    previousLength = serverImages.length;
    document.getElementById("nothingOnServer").innerHTML = "";

    if(type == 1){
        for (var i = 0; i < amountAdded; i++){
            if(checkFileOnServer(files[i].name) == false)
                serverImages.push(files[i].name);
        }
    }else{
        for (var i = 0; i < amountAdded; i++){
            if(checkFileOnServer(files[i]) == false)
                serverImages.push(files[i]);
        }
    }
    
    if(serverImages.length == previousLength)
        return;
    if(tableAmount == 10){
        document.getElementById("imgTableTitle").innerHTML = "Afbeeldingen beschikbaar op server (" + serverImages.length + ")";
        if(arrows == false)
            createArrows(table);
        document.getElementById("nextServerImg").classList.remove("arrow_last");
        return;
    }
    if((tableAmount) < 10){
        loadServerImagesFromIndex(selectedServerTable,0,previousLength);
        if(tableAmount == 10){
            if((serverImages.length > 10) && arrows == false)
                createArrows(table);
            let max = serverImages.length/(maxServerTableHeight * maxServerTableWidth);
            if(selectedServerTable + 1 >= max)
                return;
            document.getElementById("nextServerImg").classList.remove("arrow_last");
        }
    }else{
        if(arrows == true){
            loadServerImagesFromIndex(selectedServerTable,0,previousLength);
            if(tableAmount == 10)
                document.getElementById("nextServerImg").classList.remove("arrow_last")
        }
        else{
            arrows = true;
            createArrows(document.getElementById("serverImgTable"));
            loadServerImagesFromIndex(selectedServerTable,0,previousLength);
        }
    }
}

/**
 * Adds one or more images to the serverImgTable
 * @param {int} start From which image in the serverImages array we will start to
 *      add images to the serverImgTable
 * @param {int} end The last index of the image we want to add to the serverImgTable
 * @param {boolean} startup Wether or not the serverImgTable is created for the 
 *      first time.
 */
function addServerImageToTable(start, end, startup){

    let table = document.getElementById("serverImgTable");
    for(let i = start; i <= end; i++){
        let td = document.createElement("td");
        let check = document.createElement("input");
        let label = document.createElement("label");
        let prevlabel = document.createElement("label")
        let span = document.createElement("span");

        td.appendChild(label);
        td.appendChild(prevlabel);
        td.id = serverImages[i] + ("x");
        check.type = "checkbox";
        check.id = serverImages[i] + ("checkbox");
        check.className += "checkbox ";
        label.appendChild(check);
        label.appendChild(span);
        label.className += "checkcontainer ";
        prevlabel.appendChild(document.createTextNode(serverImages[i]));
        prevlabel.className += "checklabel ";
        //When clicked the selected image will be displayed.
        prevlabel.addEventListener("click", displayServerImage);
        span.className += "checkmark ";
        
        /* When checked add to selectedServerTable. When unchecked, depending on
         * gametype either remove from selectedServerTable or clear whole
         * selectedServerTable.
         */
        check.addEventListener("change",function(){
            if(this.checked)
                addFileToSelectedTable(serverImages[i]);
            else if((strcmp(currentGametype, "uniek") == 0))
                clearSelectedTable();
            else
                removeFileFromSelectedTable(serverImages[i]);
        });

        //When the serverImgTable is created for the first time.
        if(startup == true){
            td.setAttribute("style","padding-right:1em");
            td.classList.add("serverImgEntry");
            if(i%2 == 0){
                let k = i/2;
                if(arrows == true){k += 1;}
                let tr = table.insertRow(k);
                tr.appendChild(td);
                tr.id = "rowid" + (k.toString());
            }else{
                //Start appending in de second column.
                //Arrow navigation takes up 1 row
                let appendRow = (Math.floor(i/2) + (arrows ? 1:0));
                let toRow = table.children[0].children[appendRow];
                toRow.appendChild(td);
            }
        }
        //When we're changing the already existing serverImgTable.
        else{
            for(let l = 0; l < selectedImages.length; l++){
                if(strcmp(serverImages[i], selectedImages[l]) == 0)
                    check.checked = "true";
                    
            }
    
            let k = (i-start);
            let j
            if(k<2)
                j = 1;
            else if(k<4)
                j = 2;
            else if(k<6)
                j = 3;
            else if(k<8)
                j = 4;
            else
                j = 5;
    
            let row = document.getElementById("rowid" + (j.toString()));
            if (row != null){
                row.appendChild(td);
            }else{
                let newrow = document.createElement("tr");
                newrow.appendChild(td);
                table.appendChild(newrow);
                newrow.id = "rowid" + (j.toString());
            }
    
            //Check if the selected images is on the page if it is give it the class selectedServerEntry
            //also check if there are elements with the class selectedServerEntry that are not the selected element
            if(td.innerText != selectedServerImage.text && td.classList.contains("selectedServerEntry"))
                td.classList.remove("selectedServerEntry");
            if(td.innerText == selectedServerImage.text)
                td.classList.add("selectedServerEntry");
        }
    }
}