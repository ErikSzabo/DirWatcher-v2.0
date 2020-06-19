const fsp = require('./utils/fsPromises');
const fs = require('fs');
const path = require('path');
const Datastore = require('nedb-promises');

/**
 * Database to store root folders.
 */
const rootDB = Datastore.create({ filename: path.resolve(__dirname, 'root.db'), autoload: true });
/**
 * Database to store sub folders.
 */
const subDB = Datastore.create({ filename: path.resolve(__dirname, 'sub.db'), autoload: true });

/**
 * Loads and returns the options from the options.json file.
 * 
 * @returns options object
 */
function loadOptions() {
	return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'options.json')));
}

/**
 * Saves the give options object to the options.json file.
 * 
 * @param {*} options options object which will be saved
 */
function saveOptions(options) {
	fs.writeFileSync(path.resolve(__dirname, 'options.json'), JSON.stringify(options));
}

/**
 * Saves the given root folder into the root database.
 * 
 * @param {*} rootFolder 	root folder which will be saved to the database
 * @returns 				the newly saved root folder
 */
async function saveRootFolder(rootFolder) {
	return await rootDB.insert(rootFolder);
}

/**
 * Saves the given sub folder into the sub database.
 * 
 * @param {*} subFolder sub folder which will be saved to the database
 * @returns 			the newly saved sub folder
 */
async function saveSubFolder(subFolder) {
	return await subDB.insert(subFolder);
}

/**
 * Returns a root folder by its ID from the database or undefined
 * if it is not exists.
 * 
 * @param {*} id 	folder id in the database
 * @returns 		root folder
 */
async function getRootFolder(id) {
	return await rootDB.findOne({ _id: id });
}

/**
 * Returns a root folder by its path from the database, or undefined
 * if there is not any root folder with the path.
 * 
 * @param {*} path 	root folders path
 * @returns 		root folder
 */
async function getRootByPath(path) {
	return await rootDB.find({ path: path });
}

/**
 * Returns a sub folder from the database based on its ID.
 * 
 * @param {*} id 	id of the sub folder
 * @returns 		sub folder
 */
async function getSubFolder(id) {
	return await subDB.findOne({ _id: id });
}

/**
 * Returns sub folders from the database based on 
 * their parent IDs.
 * 
 * @param {*} rootID 	id of the parent folder
 * @returns 			sub folders
 */
async function getSubFolders(rootID) {
	return await subDB.find({ parentID: rootID });
}

/**
 * Updates the extension array on the sub folder
 * which has the same id as the subID parameter.
 * 
 * @param {*} subID 		id of the sub folder
 * @param {*} extensions 	new extension array which will be saved
 */
async function updateSubExtensions(subID, extensions) {
	subDB.update({ _id: subID }, { $set: { extensions: extensions } });
}

/**
 * Removes a root folder from the database based on its ID.
 * 
 * @param {*} id id of the root folder
 */
function deleteRootFolder(id) {
	rootDB.remove({ _id: id });
}

/**
 * Removes a sub folder from the database based on its ID.
 * 
 * @param {*} id id of the sub folder 
 */
function deleteSubFolder(id) {
	subDB.remove({ _id: id });
}

/**
 * Removes all the sub folders with the given parentID.
 * 
 * @param {*} rootID parent(root) folder id
 */
function deleteSubFolders(rootID) {
	subDB.remove({ parentID: rootID }, { multi: true });
}

/**
 * Returns all of the root folders from the database.
 * 
 * @returns all of the root folders data
 */
async function loadAllRoots() {
	return await rootDB.find({});
}

/**
 * Returns all of the sub folders from the database.
 *
 * @returns all of the sub folders data
 */
async function loadAllSubs() {
	return await subDB.find({});
}

/**
 * If the logs folder does not exists yet, it will be created
 * by calling this function.
 */
async function createLogFolder() {
	try {
		await fsp.mkdir(path.resolve(__dirname, '../../logs'));
	} catch (e) {
		console.log('Log folder already exists!');
	}
}

/**
 * Reads all the filenames inside the log folders and creates a
 * name/date object from them.
 * 
 * @returns logs
 */
async function getLogs() {
	const filenames = await fsp.readdir(path.resolve(__dirname, '../../logs'));
	const logs = [];
	for (const filename of filenames) {
		if (!filename.includes('.log')) continue;
		logs.push({
			name: filename,
			date: filename.substr(11, 10)
		});
	}
	return logs;
}

module.exports = {
	loadOptions,
	saveOptions,
	saveRootFolder,
	saveSubFolder,
	getRootFolder,
	getRootByPath,
	getSubFolder,
	getSubFolders,
	updateSubExtensions,
	deleteRootFolder,
	deleteSubFolder,
	deleteSubFolders,
	loadAllRoots,
	loadAllSubs,
	createLogFolder,
	getLogs
};
