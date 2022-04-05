var myForm = document.getElementById('formAjax');  // Our HTML form's ID
var myFile = document.getElementById('fileAjax');  // Our HTML files' ID
var statusP = document.getElementById('status');

// Create a FormData object
var formData = new FormData();

myForm.onsubmit = function(event) {
    event.preventDefault();

    statusP.innerHTML = 'Uploading...';

    // Get the files from the form input
    var files = myFile.files;

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

      //clear previous data
      formData = new FormData();
    }
}
