async function initApp() {
    const fileInput = document.querySelector('input');
    fileInput.addEventListener('change', handleFileInput);

    const droparea = document.querySelector('.droparea');
    const downloadButton = document.querySelector('.download-button');
    const textareaButton = document.querySelector('.textarea-button');

    const active = () => droparea.classList.add("green-border");
    const inactive = () => droparea.classList.remove("green-border");
    const prevents = (e) => e.preventDefault();

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
        droparea.addEventListener(evtName, prevents);
    });
    ['dragenter', 'dragover'].forEach(evtName => {
        droparea.addEventListener(evtName, active);
    });
    ['dragleave', 'drop'].forEach(evtName => {
        droparea.addEventListener(evtName, inactive);
    });
    droparea.addEventListener("drop", handleDrop);

    downloadButton.addEventListener("click", downloadFile);
    textareaButton.addEventListener("click", onTextareaButtonClicked);

    const textarea = document.querySelector('textarea');
    textarea.value = await getText();
    const fileNameText = document.querySelector('small');
    fileNameText.innerHTML = await getFileName();
}

document.addEventListener("DOMContentLoaded", initApp);

async function handleDrop(e) {
    const dataTransfer = e.dataTransfer;
    const files = dataTransfer.files;
    const fileArray = [...files];

    if (fileArray[0].size > 50000000) { // larger than 50 mb
        alert("file exceeds 50 megabytes");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileArray[0]);

    await fetch('http://192.168.7.144:8001/set_file', {
        method: 'POST',
        body: formData
    });

    const fileNameText = document.querySelector('small');
    fileNameText.innerHTML = await getFileName();
}

async function handleFileInput(e) {
    const file = e.target.files[0];

    if (file.size > 50000000) { // larger than 50 mb
        alert("file exceeds 50 megabytes");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    await fetch('http://192.168.7.144:8001/set_file', {
        method: 'POST',
        body: formData
    });

    const fileNameText = document.querySelector('small');
    fileNameText.innerHTML = await getFileName();
}

async function getClipboardText() {
    const response = await fetch('http://192.168.7.144:8001/get_text', {
        method: 'GET'
    });
    return response;
}

async function onTextareaButtonClicked(e) {
    const textarea = document.querySelector('textarea');

    const text = await fetch('http://192.168.7.144:8001/set_text', {
        method: 'POST',
        body: textarea.value
    });
}

function downloadFile() {
    const link = document.createElement('a');
    link.href = 'http://192.168.7.144:8001/get_file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function getText(){
    const response = await fetch('http://192.168.7.144:8001/get_text', {
        method: 'GET'
    });
    const text = await response.text();
    return text;
}

async function getFileName(){
    const response = await fetch('http://192.168.7.144:8001/get_file_name', {
        method: 'GET'
    });
    const text = await response.text();
    return text;
}