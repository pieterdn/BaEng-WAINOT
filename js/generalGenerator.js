var selectedImages = [];
const maxTableHeight = 5;

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
        selectedImages[selectedImages.length + i] = files[i];
        addFileToTable(files[i])
    }
}

function createServerImgTable(){
    let div = document.getElementById("allImages");
    if(serverImages.length == 0)
        return;
    div.removeChild(div.firstChild);
    let table = document.createElement("table");
    for(let i = 0; i < serverImages.length; i++){
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(serverImages[i]));
        td.addEventListener("click",displayServerImage);
        if(i<5){
            let tr = document.createElement("tr");
            tr.appendChild(td);
            table.appendChild(tr);
        }else{
            table.children[i%5].appendChild(td);
        }
    }

    div.appendChild(table);
}

function displayServerImage(event){
    console.log(event.target);
    let servImg = document.getElementById("serverImage");
    
    let img = document.createElement("img");
    img.onload = function(){
        
        console.log(img.naturalWidth + "  " +img.naturalHeight);
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
    td.appendChild(document.createTextNode(file.name));
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