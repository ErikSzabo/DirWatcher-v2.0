import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

export class Nav extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return css`
			.nav-menu {
				display: flex;
				width: 100%;
				height: 75px;
				align-items: center;
				background-color: coral;
				background-color: var(--custom-black);
			}

			.nav-item {
				flex: 1;
			}

			.nav-btns {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;
				grid-gap: 40px;
				padding-right: 30px;
			}

			.menu-item {
				color: white;
				text-transform: uppercase;
				font-size: 18px;
				cursor: pointer;
			}

			.nav-title {
				font-size: 25px;
				padding-left: 30px;
				font-weight: 600;
				color: white;
				cursor: pointer;
			}

			.nav-title > div > span {
				font-weight: normal;
				font-size: 20px;
			}
		`;
	}

	render() {
		return html`
			<nav class="nav-menu">
				<div @click="${this.indexListener}" class="nav-title nav-item"><div>DirWatcher <span>v2.0</span></div></div>
				<div class="nav-btns nav-item">
					<p @click="${this.logsListener}" class="menu-item logs-menu">Logs</p>
					<p @click="${this.optionListener}" class="menu-item options-menu">Options</p>
					<p @click="${this.dashboardListener}" class="menu-item dashboard-menu">Dashborad</p>
				</div>
			</nav>
		`;
	}

	indexListener() {
		document.querySelector('main').innerHTML = `
				<index-page>
					<index-page-element name="github" url="https://github.com/ErikSzabo/DirWatcher-v2.0"></index-page-element>
					<index-page-element name="author" url="https://github.com/ErikSzabo"></index-page-element>
				</index-page>
		`;
	}

	optionListener() {
		document.querySelector('main').innerHTML = `
				<options-page>
					<option-item id="folderMonitoring" title="Folder Monitoring">
						Enables folder monitoring, which means, you can keep track of the changes 
						in your watched folders. New log file will be created in every new day. You can 
						view logs in the logs folder or at the logs page.
					</option-item>
					<option-item id="autoStart" title="Auto Start">
						You can start DirWatcher instantly when your operating system loaded up.
					</option-item>
				</options-page>
		`;
	}

	async logsListener() {
		for (const child of document.querySelector('main').children) {
			child.remove();
		}
		const logs = await require('electron').ipcRenderer.invoke('get:logs');
		const logPage = document.createElement('log-page');
		for (const log of logs) {
			logPage.innerHTML += `
				<log-list-item name="${log.name}" dateString="${log.date}"></log-list-item>
			`;
		}
		document.querySelector('main').appendChild(logPage);
	}

	async dashboardListener() {
		const { ipcRenderer } = require('electron');
		const rootData = await ipcRenderer.invoke('get:all:root');
		const subData = await ipcRenderer.invoke('get:all:sub');
		let html = '<dashboard-page id="dashboard">';

		for (let root of rootData) {
			html += `<root-folder name="${root.name}" id="${root._id}">`;
			for (let sub of subData) {
				if (sub.parentID === root._id) {
					html += `<sub-folder class="hide" name="${sub.name}" parentID="${root._id}" id="${sub._id}"></sub-folder>`;
				}
			}
			html += '</root-folder>';
		}

		html += '</dashboard-page>';

		document.querySelector('main').innerHTML = html;
	}
}
