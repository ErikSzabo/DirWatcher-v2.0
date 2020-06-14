import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

export class DashboradPage extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return css`
			.container {
				margin: auto;
				width: calc(100vw - 40px);
			}

			.start {
				display: flex;
				align-items: flex-start;
				justify-content: space-evenly;
				margin-bottom: 20px;
			}

			input {
				width: 500px;
				border: 1px solid #3d3d3d;
				padding: 10px;
			}

			input:focus {
				outline: none;
			}

			p {
				margin-left: 10px;
			}

			.btn {
				padding: 8px;
				width: 90px;
				background-color: white;
				color: var(--custom-black);
				font-size: 14px;
				cursor: pointer;
				display: block;
				text-align: center;
				font-weight: 500;
				border: 1px solid #3d3d3d;
			}
		`;
	}

	render() {
		return html`
		<div class="container">
			<p>Add root folder</p>
			<div class="start">
				<input type="text" placeholder="Absolute/path/to/folder/click/browse">
				<div @click="${this.browseListener}" class="btn">Browse</div>
				<div @click="${this.addListener}" class="btn">Add</div>
			</div>
			<slot />
		</div>
		`;
	}

	browseListener = () => {
		require('electron').ipcRenderer.invoke('open:explorer').then((path) => {
			if (!path) return;
			this.shadowRoot.querySelector('input').value = path;
		});
	};

	addListener = () => {
		const inputField = this.shadowRoot.querySelector('input');
		const path = inputField.value;
		require('electron').ipcRenderer.invoke('add:root', path).then((folder) => {
			inputField.value = '';
			if (!folder) return;
			document.querySelector('#dashboard').innerHTML += `
				<root-folder name="${folder.name}" id="${folder._id}"></root-folder>
			`;
		});
	};
}

export class RootFolder extends LitElement {
	constructor() {
		super();
	}

	static get properties() {
		return {
			name: { type: String },
			id: { type: String }
		};
	}

	static get styles() {
		return css`
			.start {
				display: flex;
				align-items: center;
				background-color: var(--custom-black);
				color: white;
				height: 45px;
				width: calc(100vw - 40px);
			}

			.container {
				margin-bottom: 20px;
			}

			.name,
			.btn {
				cursor: pointer;
				user-select: none;
			}

			.name {
				flex: 5;
				font-weight: bold;
				font-size: 14px;
				padding: 12px;
			}

			.btn {
				flex: 1;
				font-size: 13px;
				font-weight: bold;
				color: white;
				justify-self: center;
			}

			.btn:hover {
				color: #acacac;
			}
		`;
	}

	render() {
		return html`
		<div class="container">
			<div class="start">
				<div @click="${this.toggleListener}" class="name">${this.name}</div>
				<div @click="${this.organizeListener}" class="btn">Organize</div>
				<div @click="${this.addListener}" class="btn">Add Sub</div>
				<div @click="${this.deleteListener}" class="btn">Delete</div>
			</div>
			<slot />
		</div>
		`;
	}

	organizeListener = () => {
		// TODO: Send msg to main to handle folder organizing
	};
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
			<sub-folder name="${sub.name}" parentID="${this.id}" id="${sub._id}"></sub-folder>
		`;
	};
	deleteListener = () => {
		require('electron').ipcRenderer.send('delete:root', this.id);
		this.remove();
	};
	toggleListener = () => {
		for (const child of this.children) {
			child.classList.toggle('hide');
		}
	};
}

export class SubFolder extends LitElement {
	// This element should always has an id which is identical to
	// its neDB database id as well as its parent id
	constructor() {
		super();
	}

	static get properties() {
		return {
			name: { type: String },
			id: { type: String },
			parentID: { type: String }
		};
	}

	static get styles() {
		return css`
			.w-container {
				margin: 5px auto;
				width: 95%;
				float: right;
				height: 40px;
				border: 1px solid #b4b4b4;
				display: flex;
				align-items: center;
				background-color: white;
			}

			.colored-key {
				color: var(--blue);
				font-weight: bold;
				font-size: 12px;
				background-color: var(--light-blue);
				display: inline;
				padding: 7px;
				margin-left: 10px;
				flex: 1;
				text-align: center;
			}

			.colored-value {
				color: var(--custom-black);
				display: inline;
				font-size: 13px;
				margin-left: 20px;
				flex: 4;
			}

			.buttons {
				flex: 2;
				display: flex;
				align-items: center;
			}

			.ext,
			.delete {
				padding: 5px;
				width: 70px;
				font-size: 12px;
				height: 20px;
				background-color: var(--custom-black);
				color: white;
				text-align: center;
				margin-left: 10px;
				cursor: pointer;
			}
		`;
	}

	render() {
		return html`
		<div class="w-container">
			<div class="colored-key">sub-folder</div>
			<p class="colored-value">${this.name}</p>
			<div class="buttons">
				<div @click="${this.extListener}" class="ext">Extensions</div>
				<div @click="${this.deleteListener}" class="delete">Delete</div>
			</div>
		</div>
		`;
	}

	extListener = () => {
		// TODO: Send msg to main to open new window which opens a new window for editing
	};
	deleteListener = () => {
		require('electron').ipcRenderer.send('delete:sub', this.id);
		this.remove();
	};
}
