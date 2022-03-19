var tableArray = [];

window.addEventListener("load",function(){
    let width = document.spelgenerator.width.value;
    let height = document.spelgenerator.height.value;
    let memprev = document.getElementById("memoryPreview");

    let table = document.createElement("table");
    table.setAttribute("id","table");
    memprev.appendChild(table);

    for(let i = 0; i < height; i++){
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for(let j = 0; j < width; j++){
            //console.log();
            let td = document.createElement("td");
            let div = document.createElement("div");
            let svg = document.createElement("svg");
            let text = document.createElement("text");
            let num = j+height*i;
            svg.setAttribute("height","100%");
            svg.setAttribute("width","50%");
            svg.classList.add("img");

            text.setAttribute("x","15");
            text.setAttribute("y","10");
            text.setAttribute("fill","black");
            text.appendChild(document.createTextNode(num.toString()));


            div.setAttribute("id", i.toString() + "_" + j.toString());
            div.classList.add("card");
            
            div.classList.add(num.toString());
            
            div.setAttribute("tabindex","0");
            

            td.classList.add("cardPosition");
            tr.appendChild(td);
            td.appendChild(div);
            div.appendChild(svg);
            svg.appendChild(text)


            //vind geen betere manier
            tableArray[num] = td;
        }
    }
});