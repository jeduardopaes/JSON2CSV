const convertButton = document.getElementById('convertButton');
const saveButton = document.getElementById('saveButton');
const clearButton = document.getElementById('clearButton');
const jsonText = document.getElementById('jsonText');
const csvText = document.getElementById('csvText');
const jsonTextValidation = document.getElementById('jsonTextValidation');
const fileName = document.getElementById('fileName');
const fileNameValidation = document.getElementById('fileNameValidation');

csvText.disabled = true;

function hideValidation() {
    jsonTextValidation.hidden = true;
    fileNameValidation.hidden = true;
}

hideValidation();

clearButton.addEventListener('click', (evt) => {
    jsonText.value = '';
    csvText.value = '';
    hideValidation();
});


convertButton.addEventListener('click', (evt) => {
    hideValidation();

    if (jsonText.value === "") {
        jsonTextValidation.hidden = false;
        jsonTextValidation.innerText = 'Please insert json text into the text-box.';
        return;
    }


    try {

        let convertedIntoObjects = JSON.parse(jsonText.value);

        csvText.disabled = false;
        csvText.value = Object.keys(convertedIntoObjects[0]) + '\n';
        convertedIntoObjects.forEach(element => {
            csvText.value += Object.values(element) + '\n';
        });


        csvText.disabled = true;

    } catch (error) {
        jsonTextValidation.hidden = false;
        jsonTextValidation.innerText = 'Something went wrong, please check the file type.\nMake sure the text to convert is JSON valid.';
        console.log('Erro:' + error);
    }
});



// Code modified from  https://codepen.io/jduprey/details/xbale
(function() {
    console.log("ready!");
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //When the file input changes calls handler
        document.querySelector('#loadTextFile').onchange = function(evt) { return handleFileSelect(evt, document.querySelector('#jsonText')); };
    } else {
        fileInputValidation.innerText = 'The File APIs are not fully supported in this browser.';
    }
})();

// Handler of the file that was selected
function handleFileSelect(evt, target) {
    var files = evt.target.files;
    if (files.length > 1) {
        fileInputValidation.innerText = "Multiple files not supported...";
    }

    //File takes the first file of the list.
    file = files[0];

    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (
        function(theFile) {
            return function(e) {
                target.value = e.target.result;
            };
        }
    )(file);

    // Read in the image file as a data URL.
    reader.readAsText(file);
}

// Function to save the file with native javascript from https://robkendal.co.uk/blog/2020-04-17-saving-text-to-client-side-file-using-vanilla-js/
saveButton.onclick = function() {
    hideValidation();

    if (fileName.value === "") {
        fileNameValidation.innerText = 'Please type a name to save your file in the input above.'
        fileNameValidation.hidden = false;
    } else if (csvText.value === "") {
        fileNameValidation.innerText = 'The field of the csv text is empty.'
        fileNameValidation.hidden = false;
    } else {
        const a = document.createElement('a');
        var text = "\ufeff" + csvText.value;
        var filename = fileName.value + ".csv";
        var blob = new Blob([text], { type: "text/csv;charset=utf-8" });

        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href);
    }
};