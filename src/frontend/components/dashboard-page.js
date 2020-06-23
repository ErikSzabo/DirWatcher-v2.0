import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import { global, customCheckbox, dashboard, rootFolder, subFolder } from './styles.js';

/**
 * This page will show up when user click on the dashboard button
 * in the navigation. Dashboard should only hold root folders.
 */
export class DashboradPage extends LitElement {
	constructor() {
		super();
		require('electron').ipcRenderer.invoke('get:iswatch').then((iswatch) => {
			this.shadowRoot.querySelector('#ckbx-style-1-1').checked = iswatch.sub;
			this.shadowRoot.querySelector('#ckbx-style-1-2').checked = iswatch.root;
		});
	}

	static get styles() {
		return [ global(), customCheckbox(), dashboard() ];
	}

	render() {
		return html`
		<div class="dash-container">
			<div class="dash-area">
				<div class="add-folder">
					<input type="text" class="path-input" placeholder="absolute/path/to/folder">
					<p>Add root folder...</p>
					<div class="buttons">
						<div @click="${this.browseListener}" class="btn">Browse</div>
						<div @click="${this.addListener}" class="btn">Add</div>
					</div>
				</div>
				<div class="watch-toggle">
					<div class="switch">
						<p class="switch-item">SubWatch</p>
						<div class="ckbx-style-1">
							<input @change="${this.watchToggleListener}" type="checkbox" id="ckbx-style-1-1" value="0" name="ckbx-style-1">
							<label for="ckbx-style-1-1"></label>
						</div>
					</div>
					<div class="switch">
						<p class="switch-item">RootWatch</p>
						<div class="ckbx-style-1">
							<input @change="${this.watchToggleListener}" type="checkbox" id="ckbx-style-1-2" value="0" name="ckbx-style-2">
							<label for="ckbx-style-1-2"></label>
						</div>
					</div>
				</div>
			</div>
			<slot />
		</div>
    	`;
	}

	/**
	 * At the dashboard page, when user clicks on browse, this
	 * listener will be called.
	 * Sends a msg to the main proccess to open up an explorer.
	 * If the user choose something, the input field value will
	 * be the path.
	 */
	browseListener = () => {
		require('electron').ipcRenderer.invoke('open:explorer').then((path) => {
			if (!path) return;
			this.shadowRoot.querySelector('input').value = path;
		});
	};

	/**
	 * When user clicks on the Add button, this method will be called.
	 * Gets the path from the browse input field, and send it to the
	 * main controller. If the root folder already exists in the database,
	 * nothing will happen.
	 */
	addListener = () => {
		const inputField = this.shadowRoot.querySelector('input');
		const path = inputField.value;
		if (!path) return;
		require('electron').ipcRenderer.invoke('add:root', path).then((folder) => {
			inputField.value = '';
			if (!folder) return;
			document.querySelector('#dashboard').innerHTML += `
				<root-folder name="${folder.name}" id="${folder._id}" path="${folder.path}"></root-folder>
			`;
		});
	};

	/**
	 * Toggle the watch switch.
	 * 0 - toggle root watchers
	 * 1 - toggle sub watchers
	 * 
	 * @param {*} e dom event 
	 */
	watchToggleListener = (e) => {
		if (e.target.getAttribute('id') === 'ckbx-style-1-1') {
			require('electron').ipcRenderer.send('watch:toggle', 1);
		} else if (e.target.getAttribute('id') === 'ckbx-style-1-2') {
			require('electron').ipcRenderer.send('watch:toggle', 0);
		}
	};
}

/**
 * Component to display root folders at the dashboard page.
 * Every root folder should have an id that is identical with
 * its database id.
 */
export class RootFolder extends LitElement {
	constructor() {
		super();
	}

	static get properties() {
		return {
			name: { type: String },
			id: { type: String },
			path: { type: String }
		};
	}

	static get styles() {
		return [ rootFolder(), global() ];
	}

	render() {
		return html`
      	<div class="root-container">
            <div class="root-folder">
                <div @click="${this.toggleListener}" class="info">
                    <div class="name">${this.name}</div>
                    <div class="path">path: <span class="sm-path">${this.path}</span></div>
                </div>
                <div class="root-buttons">
                    <div @click="${this.organizeListener}" class="root-btn">Organize</div>
                    <div @click="${this.addListener}" class="root-btn">Add Sub</div>
                    <div @click="${this.deleteListener}" class="root-btn rt-del">Delete</div>
                </div>
            </div>
            <slot />
        </div>
    	`;
	}

	/**
	 * This will be called when user clicks on the organize button.
	 * A message will be sent to the main controller to organize the
	 * root folder. (sort files to subs by extensions)
	 */
	organizeListener = () => {
		require('electron').ipcRenderer.send('root:organize', this.id);
	};

	/**
	 * Will be called when user clicks on Add Sub button.
	 * A message will be sent to the main controller with the root id
	 * and the new sub path if there is any. If the sub is already
	 * connected to the actual root folder, nothing will happen.
	 */
	addListener = async () => {
		const { ipcRenderer } = require('electron');
		const path = await ipcRenderer.invoke('open:explorer');
		if (!path) return;
		const rootID = this.id;
		const sub = await ipcRenderer.invoke('add:sub', { rootID, path });
		if (!sub) return;
		for (const child of this.children) {
			child.classList.remove('hide');
		}
		this.innerHTML += `
			<sub-folder name="${sub.name}" parentID="${this.id}" id="${sub._id}" path="${sub.path}"></sub-folder>
		`;
	};

	/**
	 * Will be called when user clicks on the delete button.
	 * A message will be sent to the main controller to delete
	 * the root folder. (and its subs)
	 * Component will be removed from the dashboard as well.
	 */
	deleteListener = () => {
		require('electron').ipcRenderer.send('delete:root', this.id);
		this.remove();
	};

	/**
	 * Will toggle subs visibility if the user clicks on the root
	 * folders name.
	 */
	toggleListener = () => {
		for (const child of this.children) {
			child.classList.toggle('hide');
		}
	};
}

/**
 * Sub folders are the children of root folders.
 * They will show up under their parent root folder.
 * Every sub folder should have and id and a parent ID.
 * id should be the same as in the database.
 * parentID should be its root folder database id.
 */
export class SubFolder extends LitElement {
	constructor() {
		super();
	}

	static get properties() {
		return {
			name: { type: String },
			id: { type: String },
			parentID: { type: String },
			path: { type: String }
		};
	}

	static get styles() {
		return [ subFolder(), global() ];
	}

	render() {
		return html`
		<div class="sub-folder">
			<div class="info">
				<div class="name">${this.name}</div>
				<div class="path">path: <span class="sm-path">${this.path}</span></div>
			</div>
			<div class="sub-buttons">
				<div @click="${this.extListener}" class="sub-btn"><img src="../images/cog-solid.svg"></div>
				<div @click="${this.deleteListener}" class="sub-btn sb-del"><img src="../images/trash-alt-solid.svg"></div>
			</div>
		</div>
    	`;
	}

	/**
	 * When user clicks on the cog wheel icon, this will be called.
	 * Will bring up a popup where user can edit the extensions
	 * for the current sub folder.
	 */
	extListener = async () => {
		const extensions = await require('electron').ipcRenderer.invoke('extensions:get', this.id);
		document.querySelector('main').innerHTML += `
		  <ext-popup subID=${this.id} extensions=${JSON.stringify(extensions)}></ext-popup>
	  `;
	};

	/**
	 * Will be called when user clicks on the trash icon.
	 * This will delete de sub folder from the database and
	 * from the ui.
	 */
	deleteListener = () => {
		require('electron').ipcRenderer.send('delete:sub', this.id);
		this.remove();
	};
}
