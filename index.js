const {app, BrowserWindow, Menu} = require('electron');
const fs = require('fs');
const si = require('systeminformation');
const shell = require('electron').shell;

const menuItems = [
    {
        label: "About",
        click: () => shell.openExternal('https://github.com/Costa-exe/BatterySpector.git')
    }
];
const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu);

const dirControl = () => {
    if (fs.existsSync('./tmp') == false) {
        fs.mkdirSync('./tmp');
    }
}

const batteryInfo = si.battery().then(data => {
    fs.writeFileSync('./tmp/battery.json', JSON.stringify(data));
});

const createWindow = async () => {
    await batteryInfo;

    const win = new BrowserWindow ({
        width: 800,
        height: 600,
        resizable: false
    });

    win.loadFile("index.html");
};

app.whenReady().then(() => {
    dirControl();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    fs.rmSync('./tmp/battery.json');
});

setInterval(() => {
    si.battery().then(data => {
        fs.writeFileSync('./tmp/battery.json', JSON.stringify(data));
    });
}, 2000);