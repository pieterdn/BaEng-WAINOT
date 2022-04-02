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
        let arrowLeft = document.createElement("i");
        let arrowRight = document.createElement("i");

        arrowLeft.classList.add("arrow");
        arrowLeft.classList.add("arrow_last");
        arrowLeft.classList.add("arrow_left");
        arrowLeft.setAttribute("id","prevServerImg");
        td1.addEventListener("click",previousServerImages);
        arrowRight.classList.add("arrow");
        arrowRight.classList.add("arrow_right");
        arrowRight.setAttribute("id","nextServerImg");
        td2.addEventListener("click",nextServerImages);
        td1.setAttribute("style","text-align:center;");
        td2.setAttribute("style","text-align:center;");

        td1.appendChild(arrowLeft);
        td2.appendChild(arrowRight);
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    //Add server images to the table
    for(let i = 0; i < tableAmount; i++){
        let td = document.createElement("td");            
        td.appendChild(document.createTextNode(serverImages[i]));
        td.addEventListener("click",displayServerImage);
        td.setAttribute("style","padding-right:1em");
        td.classList.add("serverImgEntry");
        if(i%2 == 0){
            let tr = document.createElement("tr");
            tr.appendChild(td);
            table.appendChild(tr);
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
    loadServerImagesFromIndex(++selectedServerTable);
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

    loadServerImagesFromIndex(--selectedServerTable);
    if(selectedServerTable == 0)
        document.getElementById("prevServerImg").classList.add("arrow_last");
}

/**
 * Changes the innerText of tds in the table to the specified 'page'
 * @param {number} start must be a positive integer smaller than number of server images divided by max height * max width 
 */
function loadServerImagesFromIndex(start){
    
    start = start*(maxServerTableHeight * maxServerTableWidth);
    let end = start + maxServerTableHeight * maxServerTableWidth;
    let table = document.getElementById("serverImgTable");
    for(let i = start; i < end; i++){
        let td = table.children[Math.floor((i-start)/2) + 1].children[i%2];
        if(i < serverImages.length){
            if(td.innerText == "")
                td.classList.add("serverImgEntry");

            td.innerText = serverImages[i];
        }else{
            td.innerText = "";
            td.classList.remove("serverImgEntry");
        }

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
    }else{
        let servImg = document.getElementById("serverImage");
        let button = document.createElement("button");
        button.className += "button-1";
        button.appendChild(document.createTextNode("Selecteer afbeelding"));
        button.addEventListener("click",function(){
            addFileToSelectedTable(selectedServerImage.text);
        });
        servImg.parentElement.appendChild(button);
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
            img.setAttribute("style","width:" + maxWidth + ";margin:1em;");
        else
            img.setAttribute("style","height:" + maxHeight + ";margin:1em;");
        while(!img.complete);
        if(servImg.firstChild != null)
            servImg.removeChild(servImg.firstChild);

        servImg.appendChild(img);
    }
    img.setAttribute("src","./media/" + event.target.textContent);
    
}