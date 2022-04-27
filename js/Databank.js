
window.addEventListener("load",setStart);

function setStart(){
    sendSQL(123);
}

function setOutput(){
    if(httpObject.readyState == 4){
        var response = httpObject.responseText;
        var items = response.split(";");
        var tabel = document.getElementById("table");
        var rows = tabel.getElementsByTagName("tr");
        var height = rows.length;
        var count = (rows*height)/2;
        for(var i=0; i<count; i++){
            if(items[i] == '1'){
                var element = document.getElementsByClassName(count);
                element.add('shown');
                element.add('correct');
            }
        }
    }
}

function sendSQL(id){
    httpObject = getHTTPObject();
    if(httpObject != null){
        httpObject.open("POST","/savaProgress.php",true);
        httpObject.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var data = id;
        httpObject.send(data);
        httpObject.onreadystatechange = setFeedback;
    }
}

function getHTTPObject(){
    return new XMLHttpRequest();
}