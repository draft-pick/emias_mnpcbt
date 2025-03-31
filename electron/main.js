const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

const isDev = !app.isPackaged;

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, '../assets/images/logo-desktop.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,          // 👈 добавляем
            contextIsolation: false,         // 👈 и это
            webSecurity: false, // 👈 добавляем ЭТО
        },
    });

    win.webContents.openDevTools();

    if (isDev) {
        win.loadURL('http://localhost:5173');
    } else {
        const filePath = path.join(__dirname, '../dist/index.html');
        console.log('📂 Загрузка файла:', filePath);
        win.loadURL(`file://${filePath}`);
    }
}

app.whenReady().then(() => {
    createWindow();

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('❌ Не удалось загрузить страницу:', errorDescription);
    });

    if (!isDev) {
        autoUpdater.checkForUpdates();

        autoUpdater.on('update-available', () => {
            console.log('🔄 Обновление доступно');
        });

        autoUpdater.on('update-downloaded', () => {
            console.log('✅ Обновление загружено — перезапуск...');
            dialog
                .showMessageBox(win, {
                    type: 'info',
                    title: 'Обновление',
                    message: 'Доступна новая версия. Приложение будет перезапущено.',
                    buttons: ['ОК'],
                })
                .then(() => {
                    autoUpdater.quitAndInstall();
                });
        });

        autoUpdater.on('error', (err) => {
            console.error('❌ Ошибка при обновлении:', err);
        });
    }
});