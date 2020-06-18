const fs = require('fs');

/**
 * Renames or moves a file from the old path to the
 * new path.
 * 
 * @param {*} oldPath   old path of the file
 * @param {*} newPath   new path for the file
 */
function rename(oldPath, newPath) {
	return new Promise((resolve, reject) => {
		fs.rename(oldPath, newPath, (error) => {
			if (error) reject(error);
			resolve('Rename was successfull.');
		});
	});
}

/**
 * Tests if a file is exists or not.
 * 
 * @param {*} path path to test whether it's exist or not 
 */
function exists(path) {
	return new Promise((resolve, reject) => {
		fs.access(path, (error) => {
			if (error) resolve(false);
			resolve(true);
		});
	});
}

/**
 * Creates a directory at the given path. If the directory
 * already exists, it will reject the promise.
 * 
 * @param {*} path path for the directory
 */
function mkdir(path) {
	return new Promise((resolve, reject) => {
		fs.access(path, (error) => {
			if (error) {
				fs.mkdir(path, (error) => {
					if (error) reject(error);
					resolve('Directory created!');
				});
			} else {
				reject("Directory can't be created.");
			}
		});
	});
}

/**
 * Reads all the files from a directory.
 * 
 * @param {*} path path to read 
 */
function readdir(path) {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (error, files) => {
			if (error) reject(error);
			resolve(files);
		});
	});
}

module.exports = {
	rename,
	exists,
	mkdir,
	readdir
};
