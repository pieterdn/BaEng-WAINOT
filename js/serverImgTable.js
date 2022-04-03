/**
 * This file handles the table that displays the images in de media folder on the server.
 * Used HTML Ids:
 * allImages : parent div of serverImgTable
 * serverImgTable : table of images on server in the media folder
 * prevServerImg : navigation button for serverImgTable
 * nextServerImg : navigation button for serverImgTable
 * serverImage : the displayed server image
 * 
 * Used HTML classes:
 * arrow : class used in css to create arrow
 * arrow_last : class used in css to communicate with user that last page has been reached
 * arrowLeft : class used in css to specify left arrow
 * arrow_right : class used in css to specify right arrow
 * serverImgEntry : class used in css and js
 * selectedServerEntry : class used in css and js
 */
var selectedImages = [];
var selectedServerTable = 0;

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
     * This setters sets the element to newEl and the text to the innerText of this element
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
const maxServerTableHeight = 5;
const maxServerTableWidth = 2;

window.addEventListener("load",function(){
    createServerImgTable();
});

/**
 * Should only be called after the pages has loaded.
 * Creates the server image table.
 * @requires var serverImages: an array of strings of the files on the server in the media folder
 */
function createServerImgTable(){
    if(serverImages.length == 0){
        div.appendChild(document.createTextNode("Geen afbeeldingen op de server"));
        return;
    }
    

    let div = document.getElementById("allImages");
    let table = document.createElement("table");
    table.setAttribute("id","serverImgTable");

    //If they are more server images than the max table height times width arrow keys are generated to navigate
    let tableAmount = serverImages.length;
    let arrows = false;
    if(tableAmount > maxServerTableHeight*maxServerTableWidth){
        tableAmount = maxServerTableHeight*maxServerTableWidth;
        arrows = true;
    }
    
    //generate arrow keys
    if(arrows){
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let tr = document.createElement("tr");
        let arrowLeft = document.createElement("div");
        let arrowRight = document.createElement("div");
        let spanLeft = document.createElement("span");
        let spanRight = document.createElement("span");

        arrowLeft.classList.add("arrow");
        arrowLeft.classList.add("arrow_last");
        arrowLeft.classList.add("arrow_left");
        arrowLeft.setAttribute("id","prevServerImg");
        spanLeft.className += "front";
        spanRight.className += "front";
        td1.addEventListener("click",previousServerImages);
        arrowRight.classList.add("arrow");
        arrowRight.classList.add("arrow_right");
        arrowRight.setAttribute("id","nextServerImg");
        td2.addEventListener("click",nextServerImages);
        td1.setAttribute("style","text-align:center;");
        td2.setAttribute("style","text-align:center;");

        arrowLeft.appendChild(spanLeft);
        arrowRight.appendChild(spanRight);
        td1.appendChild(arrowLeft);
        td2.appendChild(arrowRight);
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    //console.log(serverImages);
    //Add server images to the table
    for(let i = 0; i < tableAmount; i++){
        
        let td = document.createElement("td");
        let check = document.createElement("input");
        let label = document.createElement("label");
        let prevlabel = document.createElement("label")
        let span = document.createElement("span");
        check.type = "checkbox";
        check.id = serverImages[i] + ("checkbox");
        check.className += "checkbox";
        span.className += "checkmark";
        label.className += "checkcontainer";
        label.appendChild(check);
        label.appendChild(span);
        prevlabel.appendChild(document.createTextNode(serverImages[i]));
        prevlabel.className += "checklabel";
        td.appendChild(label);
        td.appendChild(prevlabel);
        check.addEventListener("change",function(){
            if(this.checked){
                addFileToSelectedTable(serverImages[i]);
            }else{
                removeFileFromSelectedTable(serverImages[i]);
            }
        });
        prevlabel.addEventListener("click",displayServerImage);
        td.setAttribute("style","padding-right:1em");
        td.classList.add("serverImgEntry");
        td.id = serverImages[i] + ("x");
        if(i%2 == 0){
            let k = i/2;
            let tr = document.createElement("tr");
            //console.log(k);
            tr.appendChild(td);
            table.appendChild(tr);
            tr.id = "rowid" + (k.toString());
        }else{
            //Start appending in de second column.
            //Arrow navigation takes up 1 row
            let appendRow = Math.floor(i/2) + (arrows ? 1:0);
            // console.log(appendRow);
            // console.log(table.children[appendRow]);
            table.children[appendRow].appendChild(td);
        }
        
    }
    div.appendChild(table);
}

/**
 * Goes to next 'page' of server images
 */
function nextServerImages(){
    let max = serverImages.length/(maxServerTableHeight * maxServerTableWidth);

    if(selectedServerTable + 1 > max)
        return;
    if(selectedServerTable == 0)
        document.getElementById("prevServerImg").classList.remove("arrow_last");
    loadServerImagesFromIndex(++selectedServerTable,1);
    if(selectedServerTable + 1 > max)
        document.getElementById("nextServerImg").classList.add("arrow_last");
}

/**
 * Goes to previous 'page' of server images
 */
function previousServerImages(){
    
    if(selectedServerTable == 0)
        return;

    let max = serverImages.length/(maxServerTableHeight * maxServerTableWidth);
    if(selectedServerTable + 1 > max)
        document.getElementById("nextServerImg").classList.remove("arrow_last");

    loadServerImagesFromIndex(--selectedServerTable,-1);
    if(selectedServerTable == 0)
        document.getElementById("prevServerImg").classList.add("arrow_last");
}

/**
 * Changes the innerText of tds in the table to the specified 'page'
 * @param {number} start must be a positive integer smaller than number of server images divided by max height * max width 
 */
function loadServerImagesFromIndex(page, direction){
    
    let paststart;
    let pastend;
    let start;
    let end;

    if(direction == 1) {
        paststart = (page-1)*(maxServerTableHeight * maxServerTableWidth);
        pastend = (page*(maxServerTableHeight * maxServerTableWidth)) - 1;
        start = page*(maxServerTableHeight * maxServerTableWidth);
        let maxend = start + (maxServerTableHeight * maxServerTableWidth);
        if(serverImages.length > maxend){
            end = maxend-1;
            
        }
        else{
            end = serverImages.length-1;
        }
    }
    else if (direction == -1) {
        paststart = (page+1)*(maxServerTableHeight * maxServerTableWidth);
        let maxend = paststart + (maxServerTableHeight *maxServerTableWidth);
        if(serverImages.length > maxend){
            pastend = maxend -1;
        }
        else{
            pastend = serverImages.length -1;
        }
        start = page*(maxServerTableHeight * maxServerTableWidth);
        end = start + (maxServerTableHeight * maxServerTableWidth) -1;
    }
    //console.log(paststart, pastend, start, end);
    
    let table = document.getElementById("serverImgTable");

    for (let i = paststart; i <= pastend; i++) {
        let toremove = document.getElementById(serverImages[i] + ("x"));
        toremove.parentNode.removeChild(toremove);
      }

    for(let i = start; i <= end; i++){
 
        let td = document.createElement("td");

        let check = document.createElement("input");
        let label = document.createElement("label");
        let prevlabel = document.createElement("label");
        let span = document.createElement("span");
        check.type = "checkbox";
        check.className += "checkbox";
        check.id = serverImages[i] + ("checkbox");
        span.className += "checkmark";
        label.className += "checkcontainer";
        label.appendChild(check);
        label.appendChild(span);
        prevlabel.appendChild(document.createTextNode(serverImages[i]));
        prevlabel.className += "checklabel";
        td.appendChild(label);
        td.appendChild(prevlabel);
        td.id = serverImages[i] + ("x");
        check.addEventListener("change",function(){
            if(this.checked){
                addFileToSelectedTable(serverImages[i]);
            }else{
                removeFileFromSelectedTable(serverImages[i]);
            }
        });
        prevlabel.addEventListener("click", displayServerImage);
        for(let l = 0; l < selectedImages.length; l++){
            if(strcmp(serverImages[i], selectedImages[l]) == 0){
                check.checked = "true";
            }
                
        }

        //console.log(i-start, i);
        let k = (i-start);
        let j
        if(k<2)
            j = 0;
        else if(k<4)
            j = 1;
        else if(k<6)
            j = 2;
        else if(k<8)
            j = 3;
        else
            j = 4;

        //console.log(j);
        let row = document.getElementById("rowid" + (j.toString()));
        row.appendChild(td);

        //Check if the selected images is on the page if it is give it the class selectedServerEntry
        //also check if there are elements with the class selectedServerEntry that are not the selected element
        if(td.innerText != selectedServerImage.text && td.classList.contains("selectedServerEntry")){
            td.classList.remove("selectedServerEntry");
        }
        if(td.innerText == selectedServerImage.text){
            td.classList.add("selectedServerEntry");
        }
    }
}

/**
 * Displays the clicked serverImgEntry if the innerText does not equal ""
 * @param {Event} event click event on a serverImgEntry
 */
function displayServerImage(event){
    if(event.target.textContent == "")
        return;

    if(selectedServerImage.element != null){
        selectedServerImage.element.classList.remove("selectedServerEntry");
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
    img.className += "zoom";
}

function addServerImage(files){
    serverImages.push(files);
}