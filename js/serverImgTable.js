var selectedImages = [];
var selectedServerTable = 0;
var selectedServerImage = null;
const maxServerTableHeight = 5;
const maxServerTableWidth = 2;

window.addEventListener("load",function(){
    createServerImgTable();
});

function createServerImgTable(){
    let div = document.getElementById("allImages");
    if(serverImages.length == 0){
        div.appendChild(document.createTextNode("Geen afbeeldingen op de server"));
        return;
    }
    let table = document.createElement("table");
    table.setAttribute("id","serverImgTable");
    let tableAmount = serverImages.length;
    let arrows = false;
    if(tableAmount > maxServerTableHeight*maxServerTableWidth){
        tableAmount = maxServerTableHeight*maxServerTableWidth;
        arrows = true;
    }
    

    if(arrows){
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let tr = document.createElement("tr");

        let arrow_left = document.createElement("i");
        let arrow_right = document.createElement("i");
        arrow_left.classList.add("arrow");
        arrow_left.classList.add("last");
        arrow_left.classList.add("left");
        arrow_left.setAttribute("id","prevServerImg");
        arrow_left.addEventListener("click",previousServerImages);
        arrow_right.classList.add("arrow");
        arrow_right.classList.add("right");
        arrow_right.setAttribute("id","nextServerImg");
        arrow_right.addEventListener("click",nextServerImages);

        td1.setAttribute("style","text-align:center;width:100px;height:20px");
        td2.setAttribute("style","text-align:center;width:100px;height:20px");
        td1.appendChild(arrow_left);

        td2.appendChild(arrow_right);
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    
    for(let i = 0; i < tableAmount; i++){
        let td = document.createElement("td");            
        td.appendChild(document.createTextNode(serverImages[i]));
        td.addEventListener("click",displayServerImage);
        td.setAttribute("style","padding-right:1em");
        td.classList.add("serverImgEntry");
        if(i<maxServerTableHeight){
            let tr = document.createElement("tr");
            tr.appendChild(td);
            table.appendChild(tr);
        }else{
            let appendRow = i%maxServerTableHeight + (arrows ? 1:0);
            table.children[appendRow].appendChild(td);
        }
        
    }
    div.appendChild(table);
}

function nextServerImages(event){
    let max = serverImages.length/(maxServerTableHeight * maxServerTableWidth);
    // console.log(max);
    if(selectedServerTable + 1 > max)
        return;
    if(selectedServerTable == 0)
        document.getElementById("prevServerImg").classList.remove("last");
    loadServerImagesFromIndex(++selectedServerTable);
    if(selectedServerTable + 1 > max)
        document.getElementById("nextServerImg").classList.add("last");
}

function previousServerImages(event){
    
    if(selectedServerTable == 0)
        return;

    let max = serverImages.length/(maxServerTableHeight * maxServerTableWidth);
    if(selectedServerTable + 1 > max)
        document.getElementById("nextServerImg").classList.remove("last");

    loadServerImagesFromIndex(--selectedServerTable);
    // console.log(selectedServerTable);
    if(selectedServerTable == 0)
        document.getElementById("prevServerImg").classList.add("last");
}

function loadServerImagesFromIndex(start){
    start = start*(maxServerTableHeight * maxServerTableWidth);
    let end = start + maxServerTableHeight * maxServerTableWidth;

    let servtable = document.getElementById("allImages");
    // console.log(servtable);
    let tds = servtable.getElementsByTagName("td")
    // console.log(start);
    // console.log(end);
    for(let i = start; i < end; i++){
        if(i < serverImages.length){
            if((i - start) < maxServerTableHeight)
                tds.item(2 + 2*(i%maxServerTableHeight)).innerText = serverImages[i];
            else
                tds.item(2 + 2*(i%maxServerTableHeight) + 1).innerText = serverImages[i];
        }else{
            if((i - start) < maxServerTableHeight)
                tds.item(2 + 2*(i%maxServerTableHeight)).innerText = "";
            else
                tds.item(2 + 2*(i%maxServerTableHeight) + 1).innerText = "";
        }
    }
}

function displayServerImage(event){
    //console.log(event.target);
    if(event.target.textContent == "")
        return;

    if(selectedServerImage != null){
        selectedServerImage.classList.remove("selectedServerEntry");
    }else{
        let servImg = document.getElementById("serverImage");
        let button = document.createElement("button");
        button.className += "button-1";
        button.appendChild(document.createTextNode("Selecteer afbeelding"));
        button.addEventListener("click",function(){
            addFileToSelectedTable(selectedServerImage.textContent);
        });
        servImg.parentElement.appendChild(button);
    }
    event.target.classList.add("selectedServerEntry");
    selectedServerImage = event.target;

    let servImg = document.getElementById("serverImage");
    
    let img = document.createElement("img");
    img.onload = function(){
        //console.log(img.naturalWidth + "  " +img.naturalHeight);
        if(img.naturalWidth>img.naturalHeight)
            img.setAttribute("style","width:200px;margin:1em;");
        else
            img.setAttribute("style","height:200px;margin:1em;");
        while(!img.complete);
        if(servImg.firstChild != null)
            servImg.removeChild(servImg.firstChild);

        servImg.appendChild(img);
    }
    img.setAttribute("src","./media/" + event.target.textContent);
    
}