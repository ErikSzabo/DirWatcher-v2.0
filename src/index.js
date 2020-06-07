const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const { state } = require('./backend/state');
const controller = require('./backend/controller');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}

let appIcon, mainWindow;

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1600,
		height: 600,
		title: 'DirWatcher',
		resizable: false,
		icon: path.join(__dirname, 'images/icon.ico'),
		webPreferences: {
			nodeIntegration: true
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, './frontend/index.html'));
	Menu.setApplicationMenu(null);

	mainWindow.on('minimize', (event) => {
		event.preventDefault();
		mainWindow.hide();
	});

	appIcon = new Tray(path.join(__dirname, `/images/icon.ico`));

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Open App',
			click: function() {
				mainWindow.show();
			}
		},
		{
			label: 'Quit',
			click: function() {
				app.quit();
			}
		}
	]);

	appIcon.setContextMenu(contextMenu);
	appIcon.on('click', (event) => {
		mainWindow.show();
	});

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// Sets the autostart option before application quits.
app.on('quit', () => {
	app.setLoginItemSettings({
		openAtLogin: state.options.autoStart
	});
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
