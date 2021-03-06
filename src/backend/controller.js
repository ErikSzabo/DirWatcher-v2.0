const { ipcMain, dialog, shell } = require('electron');
const { state } = require('./state');
const { RootWatcher, SubWatcher, types } = require('./watcher');
const path = require('path');
const fsp = require('./utils/fsPromises');
const db = require('./database');
const { stat } = require('fs');

/**
 * Fired when application starts to initalize the UI.
 */
ipcMain.handle('get:all:root', async (e) => {
	return await db.loadAllRoots();
});

/**
 * Fired when application starts to initalize the UI.
 */
ipcMain.handle('get:all:sub', async (e) => {
	return await db.loadAllSubs();
});

/**
 * Fired when user tries to add a root folder.
 * Root folder name and path will be saved to the database. 
 * User can't have the same root folder multiple times.
 */
ipcMain.handle('add:root', async (e, path) => {
	// Check if it's already exists
	const result = await db.getRootByPath(path);
	if (result.length > 0) return false;

	// Add it to the database
	const splitPath = path.split('\\');
	const name = splitPath[splitPath.length - 1];
	const rootFolder = await db.saveRootFolder({ path: path, name: name });

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
	const subFolders = await db.getSubFolders(rootID);
	for (const subFolder of subFolders) {
		if (subFolder.path === path) return false;
	}

	// Add it to the database
	const splitPath = path.split('\\');
	const name = splitPath[splitPath.length - 1];
	const subFolder = await db.saveSubFolder({ path: path, name: name, parentID: rootID, extensions: [] });

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
	db.deleteRootFolder(id);
	db.deleteSubFolders(id);
});

/**
 * Fired when user wants to delete a sub folder.
 * id will be the id of the sub folder in the database.
 */
ipcMain.on('delete:sub', (e, id) => {
	state.watchers.deleteWatcher(types.SUB, id);
	db.deleteSubFolder(id);
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
	db.saveOptions(state.options);
});

/**
 * Fired when user clicks on Browse button at the dashboard page
 */
ipcMain.handle('open:explorer', async () => {
	const result = await dialog.showOpenDialog({
		properties: [ 'openDirectory' ]
	});

	return result.filePaths[0];
});

/**
 * Fired when user tries to open log folder.
 */
ipcMain.on('open:logs', () => {
	shell.openPath(path.resolve(__dirname, '../../logs'));
});

/**
 * Fired when user tries to open the extension editor popup.
 */
ipcMain.handle('extensions:get', async (e, subID) => {
	const subFolder = await db.getSubFolder(subID);
	return subFolder.extensions;
});

/**
 * Fired when user tries to save new extensions for a subfolder.
 */
ipcMain.on('extensions:save', (e, subID, extensions) => {
	db.updateSubExtensions(subID, extensions);
});

/**
 * Fired when user tries to organize a rootfolder.
 */
ipcMain.on('root:organize', async (e, rootID) => {
	const rootFolder = await db.getRootFolder(rootID);
	const subFolders = await db.getSubFolders(rootID);
	const files = await fsp.readdir(rootFolder.path);
	for (const file of files) {
		const extension = file.split('.').pop();
		for (const subFolder of subFolders) {
			if (!subFolder.extensions.includes(extension)) {
				continue;
			}
			fsp.rename(rootFolder.path + '\\' + file, subFolder.path + '\\' + file);
		}
	}
});

/**
 * Fired when user navigates to the logs page.
 */
ipcMain.handle('get:logs', async () => {
	return await db.getLogs();
});

/**
 * Fired when user wants to open a log file.
 */
ipcMain.on('log:open', async (e, filename) => {
	shell.openPath(path.resolve(__dirname, `../../logs/${filename}`));
});

/**
 * Fired when user turns on or off watching.
 */
ipcMain.on('watch:toggle', (e, type) => {
	if (type == types.ROOT) {
		if (state.watch.root) {
			state.watchers.stopAll(types.ROOT);
		} else {
			state.watchers.startAll(types.ROOT);
		}
		state.watch.root = !state.watch.root;
	} else if (type == types.SUB) {
		if (state.watch.sub) {
			state.watchers.stopAll(types.SUB);
		} else {
			state.watchers.startAll(types.SUB);
		}
		state.watch.sub = !state.watch.sub;
	}
});

/**
 * Fired when dashboard loads up.
 */
ipcMain.handle('get:iswatch', () => {
	return state.watch;
});
