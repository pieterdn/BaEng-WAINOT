window.addEventListener("load",function(){
    document.spelgenerator.addEventListener("submit",checkInput);
});

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