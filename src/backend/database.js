const fs = require('fs');
const path = require('path');
const Datastore = require('nedb-promises');

const rootDB = Datastore.create({ filename: path.resolve(__dirname, 'root.db'), autoload: true });
const subDB = Datastore.create({ filename: path.resolve(__dirname, 'sub.db'), autoload: true });

function loadOptions() {
	return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'options.json')));
}

function saveOptions(options) {
	fs.writeFile(path.resolve(__dirname, 'options.json'), JSON.stringify(options));
}

async function saveRootFolder(rootFolder) {
	return await this._rootDB.insert(rootFolder);
}

async function saveSubFolder(subFolder) {
	return await this._subDB.insert(subFolder);
}

async function getRootFolder(id) {
	return await rootDB.findOne({ _id: id });
}

async function getRootByPath(path) {
	return await rootDB.find({ path: path });
}

async function getSubFolder(id) {
	return await rootDB.findOne({ _id: id });
}

async function getSubsByPath(path) {
	return await subDB.findOne({ _id: id });
}

async function getSubFolders(rootID) {
	return await subDB.find({ parentID: rootID });
}

function deleteRootFolder(id) {
	rootDB.remove({ _id: id });
}

function deleteSubFolder(id) {
	subDB.remove({ _id: id });
}

function deleteSubFolders(rootID) {
	subDB.remove({ parentID: rootID });
}

async function loadAllRoots() {
	return await rootDB.find({});
}

async function loadAllSubs() {
	return await subDB.find({});
}

function createLogFolder() {
	if (fs.existsSync(path.resolve(__dirname, '../logs'))) return;
	fs.mkdirSync(path.resolve(__dirname, '../logs'));
}

module.exports = {
	loadOptions,
	saveOptions,
	saveRootFolder,
	saveSubFolder,
	getRootFolder,
	getRootByPath,
	getSubFolder,
	getSubsByPath,
	getSubFolders,
	deleteRootFolder,
	deleteSubFolder,
	deleteSubFolders,
	loadAllRoots,
	loadAllSubs,
	createLogFolder
};
