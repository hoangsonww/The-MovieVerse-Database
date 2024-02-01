const { ipcRenderer } = require('electron');

const main = document.getElementById("main");
const main2 = document.getElementById("main2");

function updateDOMElements() {
    if (main) main.textContent = 'Updated by Renderer';
    if (main2) main2.textContent = 'Updated by Renderer';
}

function sendMessageToMain() {
    ipcRenderer.send('message-to-main', 'Hello from Renderer');
}

ipcRenderer.on('message-from-main', (event, arg) => {
    console.log(arg);
    updateDOMElements();
});

ipcRenderer.on('update-specific-element', (event, arg) => {
    const element = document.getElementById(arg.elementId);
    if (element) element.textContent = arg.newContent;
});

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById("button-search");
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            console.log('Search button clicked');
            sendMessageToMain();
        });
    }

    updateDOMElements();
});

function requestDataFromMain() {
    ipcRenderer.send('request-data', 'Need specific data');

    ipcRenderer.on('response-data', (event, data) => {
        console.log('Received data from main process', data);
    });
}

requestDataFromMain();
