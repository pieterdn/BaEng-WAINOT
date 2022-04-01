var selectedImages = [];
var selectedTable = 0;
const maxServerTableHeight = 5;
const maxServerTableWidth = 2;

window.addEventListener("load",function(){
    document.spelgenerator.addEventListener("submit",checkInput);
    document.getElementById('formAjax').addEventListener("submit",addToFileListFromUpload);
    createServerImgTable();
});


function addToFileListFromUpload(event){
    event.preventDefault();
    let myForm = document.getElementById('formAjax');
    let files = document.getElementById('fileAjax').files;
    console.log(files);
    for(let i = 0; i < files.length; i++){
        selectedImages[selectedImages.length + i] = files[i].name;
        addFileToTable(files[i].name)
    }
}

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
    console.log(max);
    if(selectedTable + 1 > max)
        return;
    if(selectedTable == 0)
        document.getElementById("prevServerImg").classList.remove("last");
    loadServerImagesFromIndex(++selectedTable);
    if(selectedTable + 1 > max)
        document.getElementById("nextServerImg").classList.add("last");
}

function previousServerImages(event){
    
    if(selectedTable == 0)
        return;

    let max = serverImages.length/(maxServerTableHeight * maxServerTableWidth);
    if(selectedTable + 1 > max)
        document.getElementById("nextServerImg").classList.remove("last");

    loadServerImagesFromIndex(--selectedTable);
    console.log(selectedTable);
    if(selectedTable == 0)
        document.getElementById("prevServerImg").classList.add("last");
}

function loadServerImagesFromIndex(start){
    start = start*(maxServerTableHeight * maxServerTableWidth);
    let end = start + maxServerTableHeight * maxServerTableWidth;

    let servtable = document.getElementById("allImages");
    console.log(servtable);
    let tds = servtable.getElementsByTagName("td")
    console.log(start);
    console.log(end);
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

function addFileToTable(file){
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