/**
 * deze javascript functie zorgt voor het saven van de progress bij de memory 
 * 
 * het maakt grbuikt van 'savaProgress.php' aan de server kant
 * 
 */
window.addEventListener("load",setStart);

function setStart(){
    //123 veranderen naar de user ID uit databank, test.html moet bestandsnaam van het spel worden
    id = 123;
    filename = "test.html"
    sendSQL();
}

function setOutput(){
    console.log('setOutput');
    if(httpObject.readyState == 4){
        var response = httpObject.responseText;
        console.log(response);
        var items = response.split(";");
        var tabel = document.getElementById("table");
        var rows = tabel.getElementsByTagName("tr");
        var height = rows.length;
        var width = rows[0].cells.length;
        var count = (width*height)/2;
        //eerste 2 elementen zijn userID en spelmaan
        for(var i=2; i<count+2; i++){
            if(items[i] == '1'){
                var element = document.getElementsByClassName(i-2);
                element.item(0).classList.add('shown');
                element.item(0).classList.add('correct');
                element.item(1).classList.add('shown');
                element.item(1).classList.add('correct');
            }
        }
    }
}

function sendSQL(){
    httpObject = getHTTPObject();
    if(httpObject != null){
        httpObject.open("POST","/savaProgress.php",true);
        httpObject.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var data = "id="+id+"&spelnaam="+filename;
        httpObject.send(data);
        httpObject.onreadystatechange = setOutput;
    }
}

function sendSQL_progress(kaartnr){
    httpObject = getHTTPObject();
    if(httpObject != null){
        httpObject.open("POST","/savaProgress.php",true);
        httpObject.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var data = "id="+id+"&spelnaam="+filename+"&kaart="+kaartnr;
        httpObject.send(data);
        httpObject.onreadystatechange = setOutput;
    }
}

function sendSQL_reset_progress(){
    httpObject = getHTTPObject();
    if(httpObject != null){
        httpObject.open("POST","/savaProgress.php",true);
        httpObject.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var data = "id="+id+"&spelnaam="+filename+"&reset=1";
        httpObject.send(data);
        httpObject.onreadystatechange = setOutput;
    }
}


function getHTTPObject(){
    return new XMLHttpRequest();
}