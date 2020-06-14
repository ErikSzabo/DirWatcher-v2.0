const { ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { state } = require('./state');
const { RootWatcher, SubWatcher, types } = require('./watcher');
const {
	saveOptions,
	saveRootFolder,
	saveSubFolder,
	getRootByPath,
	getRootFolder,
	getSubFolder,
	getSubFolders,
	getSubsByPath,
	deleteRootFolder,
	deleteSubFolder,
	deleteSubFolders,
	loadAllRoots,
	loadAllSubs
} = require('./database');

/**
 * Fired when application starts to initalize the UI.
 */
ipcMain.handle('get:all:root', async (e) => {
	return await loadAllRoots();
});

/**
 * Fired when application starts to initalize the UI.
 */
ipcMain.handle('get:all:sub', async (e) => {
	return await loadAllSubs();
});

/**
 * Fired when user tries to add a root folder.
 * Root folder name and path will be saved to the database. 
 * User can't have the same root folder multiple times.
 */
ipcMain.handle('add:root', async (e, path) => {
	// Check if it's already exists
	const result = await getRootByPath(path);
	if (result.length > 0) return false;

	// Add it to the database
	const splitPath = path.split('\\');
	const name = splitPath[splitPath.length - 1];
	const rootFolder = await saveRootFolder({ path: path, name: name });

	// Create a watcher for the folder
	state.watchers.addWatcher(types.ROOT, new RootWatcher(rootFolder._id));

	return rootFolder;
});

/**
 * Fired when user tries to add a sub folder to a root folder.
 * Root folder can't have the same sub folder multiple times.
 */
ipcMain.handle('add:sub', async (e, { rootID, path }) => {
	// Check if already connected to the root
	const subFolders = await getSubsByPath(path);
	for (let subFolder of subFolders) {
		if (subFolder.parentID === rootID) return false;
	}

	// Add it to the database
	const splitPath = path.split('\\');
	const name = splitPath[splitPath.length - 1];
	const subFolder = await saveSubFolder({ path: path, name: name, parentID: rootID, extensions: [] });

	// Create a watcher for the folder
	state.watchers.addWatcher(types.SUB, new SubWatcher(subFolder._id));

	return subFolder;
});

/**
 * Fired when user wants to delete a root folder.
 * id will be the id of the root folder in the database.
 */
ipcMain.on('delete:root', (e, id) => {
	state.watchers.deleteWatcher(types.ROOT, id);
	deleteRootFolder(id);
	deleteSubFolders(id);
});

/**
 * Fired when user wants to delete a sub folder.
 * id will be the id of the sub folder in the database.
 */
ipcMain.on('delete:sub', (e, id) => {
	state.watchers.deleteWatcher(types.SUB, id);
	deleteSubFolder(id);
});

/**
 * Fired when anything in the renderer process tries
 * to access the current options.
 */
ipcMain.handle('get:options', () => {
	return state.options;
});

/**
 * Fired when user change an option at the options page
 */
ipcMain.on('change:options', (e, { key, value }) => {
	state.options[key] = value;
	saveOptions(state.options);
});

/**
 * Fired when user clicks on Browse button at the dashboard page
 */
ipcMain.handle('open:explorer', async () => {
	const result = await dialog.showOpenDialog({
		properties: ['openDirectory']
	});

	return result.filePaths[0];
});


/**
 * Fired when user tries to open log folder.
 */
ipcMain.on('open:logs', () => {
	shell.openPath(path.resolve(__dirname, '../../logs'));
})
