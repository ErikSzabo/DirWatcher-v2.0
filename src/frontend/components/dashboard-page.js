import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

export class DashboradPage extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return getStyle();
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
                        <input type="checkbox" id="ckbx-style-1-1" value="0" name="ckbx-style-1">
                        <label for="ckbx-style-1-1"></label>
                    </div>
                </div>
                <div class="switch">
                    <p class="switch-item">RootWatch</p>
                    <div class="ckbx-style-1">
                        <input type="checkbox" id="ckbx-style-1-2" value="0" name="ckbx-style-2">
                        <label for="ckbx-style-1-2"></label>
                    </div>
                </div>
            </div>
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
			id: { type: String },
			path: { type: String }
		};
	}

	static get styles() {
		return css`
			.root-folder {
				position: relative;
				padding: 20px;
				width: 740px;
				display: flex;
				margin-left: 30px;
				margin-top: 30px;
				box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.2);
				border-top: 4px solid #930002;
				flex-wrap: wrap;
			}

			.root-buttons {
				display: flex;
				position: absolute;
				right: 40px;
			}

			.root-btn {
				width: 80px;
				height: 30px;
				color: white;
				background-color: #24292e;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 6px;
				font-size: 12px;
				font-weight: bold;
				margin-left: 10px;
				cursor: pointer;
			}

			.rt-del {
				background-color: #b80000;
			}

			.name {
				font-size: 16px;
				font-weight: bold;
			}

			.path {
				font-size: 12px;
				font-weight: 500;
			}

			.info {
				cursor: pointer;
			}

			.sm-path {
				font-size: 10px;
				font-weight: 400;
			}
		`;
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

	organizeListener = () => {
		require('electron').ipcRenderer.send('root:organize', this.id);
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
			parentID: { type: String },
			path: { type: String }
		};
	}

	static get styles() {
		return css`
			.name {
				font-size: 14px;
				font-weight: bold;
			}

			.path {
				font-size: 12px;
				font-weight: 500;
			}

			.info {
				cursor: pointer;
			}

			.sm-path {
				font-size: 10px;
				font-weight: 400;
			}

			.sub-folder {
				position: relative;
				padding: 10px;
				padding-left: 20px;
				width: 680px;
				display: flex;
				margin-left: 60px;
				box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
			}

			.sub-buttons {
				display: flex;
				position: absolute;
				right: 20px;
			}

			.sub-btn {
				width: 30px;
				height: 30px;
				color: #24292e;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				font-weight: bold;
				cursor: pointer;
			}

			.sub-btn > img {
				width: 20px;
				height: 20px;
			}

			.sb-del > img {
				color: #b80000 !important;
			}
		`;
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

	extListener = async () => {
		const extensions = await require('electron').ipcRenderer.invoke('extensions:get', this.id);
		document.querySelector('main').innerHTML += `
		  <ext-popup subID=${this.id} extensions=${JSON.stringify(extensions)}></ext-popup>
	  `;
	};

	deleteListener = () => {
		require('electron').ipcRenderer.send('delete:sub', this.id);
		this.remove();
	};
}

function getStyle() {
	return css`
		[class^=ckbx-] {
			font-size: 24px;
		}
		[class^=ckbx-] label {
			position: relative;
			cursor: pointer;
			display: block;
		}
		[class^=ckbx-] label:after,
		[class^=ckbx-] label:before {
			content: "";
			position: absolute;
		}
		[class^=ckbx-] label:before {
			transition: background .1s .1s ease;
		}
		[class^=ckbx-] label:after {
			width: .6em;
			height: .6em;
			transition: all .2s ease;
		}
		[class^=ckbx-] input[type=checkbox] {
			position: absolute;
			opacity: 0;
		}
		[class^=ckbx-circle-] label,
		[class^=ckbx-square-] label {
			width: 1em;
			height: 1em;
		}
		[class^=ckbx-circle-] label:before,
		[class^=ckbx-square-] label:before {
			width: 1em;
			height: 1em;
			box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .3);
		}
		[class^=ckbx-circle-] input[type=checkbox]:checked + label:after,
		[class^=ckbx-square-] input[type=checkbox]:checked + label:after {
			background: #70c1b3;
		}
		@-webkit-keyframes switch-on {
			50% {
				transform: scaleX(1.3);
			}
		}
		@keyframes switch-on {
			50% {
				transform: scaleX(1.3);
			}
		}
		@-webkit-keyframes switch-off {
			50% {
				transform: scaleX(1.3);
			}
		}
		@keyframes switch-off {
			50% {
				transform: scaleX(1.3);
			}
		}
		@-webkit-keyframes switch-on-circle {
			50% {
				transform: scale(1.3);
			}
		}
		@keyframes switch-on-circle {
			50% {
				transform: scale(1.3);
			}
		}
		@-webkit-keyframes switch-off-circle {
			50% {
				transform: scale(.3);
			}
		}
		@keyframes switch-off-circle {
			50% {
				transform: scale(.3);
			}
		}
		@-webkit-keyframes stretch {
			50% {
				transform: scaleX(.3);
			}
			100% {
				transform: scaleX(1.3);
			}
		}
		@keyframes stretch {
			50% {
				transform: scaleX(.3);
			}
			100% {
				transform: scaleX(1.3);
			}
		}
		@-webkit-keyframes stretchback {
			50% {
				transform: scaleX(.3);
			}
			100% {
				transform: scaleX(1.3);
			}
		}
		@keyframes stretchback {
			50% {
				transform: scaleX(.3);
			}
			100% {
				transform: scaleX(1.3);
			}
		}
		[class^=ckbx-style-] label {
			width: 2em;
			height: 1em;
		}
		[class^=ckbx-style-] label:before {
			width: 2em;
			height: 1em;
			background: #4d4d4d;
			box-shadow: inset 0 1px 1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .2);
		}
		[class^=ckbx-style-] label:after {
			z-index: 2;
			box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .3);
			background: #fcfff4;
		}
		[class^=ckbx-style-] input[type=checkbox]:checked + label:before {
			background: #1fa0ff;
		}
		[class^=ckbx-style-] input[type=checkbox]:checked + label:after {
			left: 1.1em;
		}
		.ckbx-style-1 label:after,
		.ckbx-style-8 label:after {
			width: 1em;
			height: 1em;
			left: 0;
		}

		.ckbx-style-1 label:before {
			left: .1em;
			border-radius: 50px;
		}
		.ckbx-style-1 label:after {
			border-radius: 50px;
		}

		.ckbx-style-8 label:before {
			left: .1em;
			transition: background .1s ease;
			background: #f25f5c;
			border-radius: 50px;
			box-shadow: inset 0 1px 1px rgba(171, 66, 63, .5);
		}
		.ckbx-style-8 label:after {
			border-radius: 50px;
			-webkit-animation: switch-off .2s ease-out;
			animation: switch-off .2s ease-out;
		}
		.ckbx-style-8 input[type=checkbox]:checked + label:before {
			background: #70c1b3;
			box-shadow: inset 0 1px 1px rgba(84, 152, 140, .5);
		}
		.ckbx-style-8 input[type=checkbox]:checked + label:after {
			-webkit-animation: switch-on .2s ease-out;
			animation: switch-on .2s ease-out;
		}

		[class^=ckbx-circle-] label:before {
			border-radius: 100%;
		}
		[class^=ckbx-circle-] label:after {
			border-radius: 100%;
			left: .2em;
			top: .2em;
			background: #f25f5c;
			z-index: 2;
		}

		.ckbx-square-1 label:after {
			left: .2em;
			top: .2em;
			background: #f25f5c;
			z-index: 2;
		}

		[class^=ckbx].ckbx-small {
			font-size: .5em;
		}
		[class^=ckbx].ckbx-large {
			font-size: 1.5em;
		}
		[class^=ckbx].ckbx-xlarge {
			font-size: 2.5em;
		}
		.ckbx-circle-1 label:before,
		.ckbx-square-1 label:before {
			background: #333;
		}

		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		}
		.dash-area {
			width: 100%;
			height: 150px;
			background-color: #24292e;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.2);
		}

		.add-folder {
			width: 350px;
			height: 75px;
			position: relative;
			margin-left: 30px;
		}

		.add-folder > p {
			color: #1fa0ff;
			font-size: 14px;
			margin: 10px;
		}

		.path-input {
			width: 100%;
			height: 35px;
			border-radius: 6px;
			padding: 10px;
		}

		input:focus {
			outline: none;
		}

		.buttons {
			width: 200px;
			height: 30px;
			position: absolute;
			display: flex;
			right: -20px;
			top: 40px;
		}

		.btn {
			width: 80px;
			height: 30px;
			color: white;
			background-color: #1fa0ff;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 6px;
			font-size: 12px;
			font-weight: bold;
			margin-left: 10px;
			cursor: pointer;
		}

		.watch-toggle {
			width: 300px;
			display: flex;
			position: absolute;
			right: 0;
			justify-content: center;
			flex-direction: column;
		}

		.switch {
			display: flex;
			align-items: center;
			color: white;
			flex: 1;
			margin: 5px;
		}

		.switch-item {
			width: 90px;
			font-weight: 500;
		}
	`;
}
