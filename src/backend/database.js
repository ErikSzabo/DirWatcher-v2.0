const fs = require('fs');
const path = require('path');
const Datastore = require('nedb-promises');

const rootDB = Datastore.create({ filename: path.resolve(__dirname, 'root.db'), autoload: true });
const subDB = Datastore.create({ filename: path.resolve(__dirname, 'sub.db'), autoload: true });

export function loadOptions() {
	return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'options.json')));
}

export function saveOptions(options) {
	fs.writeFile(path.resolve(__dirname, 'options.json'), JSON.stringify(options));
}

export async function saveRootFolder(rootFolder) {
	return await this._rootDB.insert(rootFolder);
}

export async function saveSubFolder(subFolder) {
	return await this._subDB.insert(subFolder);
}

export async function getRootFolder(id) {
	return await rootDB.findOne({ _id: id });
}

export async function getRootByPath(path) {
	return await rootDB.find({ path: path });
}

export async function getSubFolder(id) {
	return await rootDB.findOne({ _id: id });
}

export async function getSubsByPath(path) {
	return await subDB.findOne({ _id: id });
}

export async function getSubFolders(rootID) {
	return await subDB.find({ parentID: rootID });
}

export function deleteRootFolder(id) {
	rootDB.remove({ _id: id });
}

export function deleteSubFolder(id) {
	subDB.remove({ _id: id });
}

export function deleteSubFolders(rootID) {
	subDB.remove({ parentID: rootID });
}
