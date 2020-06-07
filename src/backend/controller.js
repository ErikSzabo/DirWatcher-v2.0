const { ipcMain } = require('electron');
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
import { stat } from 'fs';

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
	if (result) return false;

	// Add it to the database
	const splitPath = path.split('\\');
	const name = splitPath[splitPath.length - 1];
	return await saveRootFolder({ path: path, name: name });
});

/**
 * Fired when user tries to add a sub folder to a root folder.
 * Root folder can't have the same sub folder multiple times.
 */
ipcMain.handle('add:sub', async (e, { rootID, path }) => {
	// Check if already connected to the root
	for (let subFolder of await getSubsByPath(path)) {
		if (subFolder.parentID === rootID) return false;
	}

	// Add it to the database
	const splitPath = path.split('\\');
	const name = splitPath[splitPath.length - 1];
	return await saveSubFolder({ path: path, name: name, parentID: rootID });
});

/**
 * Fired when user wants to delete a root folder.
 * id will be the id of the root folder in the database.
 */
ipcMain.on('delete:root', (e, id) => {
	deleteRootFolder(id);
});

/**
 * Fired when user wants to delete a sub folder.
 * id will be the id of the sub folder in the database.
 */
ipcMain.on('delete:sub', (e, id) => {
	deleteSubFolder(id);
});

ipcMain.handle('get:options', () => {
	return state.options;
});

ipcMain.on('change:options', (e, options) => {
	state.options = options;
	saveOptions(options);

	if (options.autoStart) {
	}
});