const electron = require('electron');
const fs = require('fs');
const path = require('path')

const { ipcRenderer: ipc, desktopCapturer, screen } = electron;

function getMainSource(desktopCapturer, screen, done) {
    const options = { types: ['screen'], thumbnailSize: screen.getPrimaryDisplay().workAreaSize }
    desktopCapturer.getSources(options, (err, sources) => {
        if (err) return console.log('Cannot capture the screen!');
        const isMainSource = source => source.name === 'Entire screen' || source.name === 'Screen 1';
        done(sources.filter(isMainSource)[0])
    });
}

function onCapture(evt, targetPath) {
    getMainSource(desktopCapturer, screen, source => {
        const png = source.thumbnail.toPng()
        const filePath = path.join(targetPath, new Date().getMilliseconds() + '.png');
        writeScreenshot(png, filePath);
    })
};

function writeScreenshot(png, targetPath) {
    fs.writeFile(targetPath, png, err => {
        if (err) {
            return console.log('Failed to write screen: ' + err);
        } else {
            return document.querySelector('#label').innerHTML = `${targetPath} salvo com sucesso!`;
        }

    })
}

ipc.on('capture', onCapture);