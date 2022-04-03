window.addEventListener("load",function(){
  var myForm = document.getElementById('formAjax');  // Our HTML form's ID (wordt nog ergens anders gebruikt pas op bij aanpassen id)
  var myFile = document.getElementById('fileAjax');  // Our HTML files' ID (dit ook)
  var statusP = document.getElementById('status');

  myForm.addEventListener("submit",function(event) {
      event.preventDefault();

      statusP.innerHTML = 'Uploading...';

      // Get the files from the form input
      var files = myFile.files;

      // Create a FormData object
      var formData = new FormData();

      // Amount of files
      var amount = files.length;

      for(var i = 0; i < amount; i++){

        // Select file number i from files array
        var file = files[i];

        // Check the file type
        if (!file.type.match('image.*')) {
            statusP.innerHTML = 'The file selected is not an image.';
            return;
        }
        else{
          //Add all uploaded files to the selected files list
            addFileToSelectedTable(files[i].name)
        }

        // Add the file to the AJAX request
        formData.append('fileAjax', file, file.name);

        // Set up the request
        var xhr = new XMLHttpRequest();

        // Open the connection
        xhr.open('POST', '/uploadHandling.php', true);

        // Set up a handler for when the task for the request is complete
        xhr.onload = function () {
          if (xhr.status == 200) {
            statusP.innerHTML = 'Upload complete!';
          } else {
            statusP.innerHTML = 'Upload error. Try again.';
          }
        };

        // Send the data.
        xhr.send(formData);
      }
  });
});
