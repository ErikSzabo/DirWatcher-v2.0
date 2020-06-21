import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

export class Nav extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return css`
			nav {
				display: flex;
				height: 55px;
				width: 100%;
				align-items: center;
				box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.2);
			}

			.front-nav {
				display: flex;
			}

			.sm-menus {
				display: flex;
				width: 50%;
				align-items: center;
			}

			.menu-item {
				cursor: pointer;
				margin-left: 20px;
			}

			.big-menu-item {
				position: absolute;
				right: 30px;
				padding: 12px;
				background: #24292e;
				color: white;
				font-weight: bold;
				top: -10px;
				cursor: pointer;
			}

			.logo {
				width: 132px;
				height: 30px;
				margin-left: 30px;
				margin-top: 10px;
				cursor: pointer;
			}
		`;
	}

	render() {
		return html`
		<nav>
			<div class="front-nav">
				<img @click="${this.indexListener}" src="../images/logo.svg" class="logo menu-item">
				<div class="sm-menus">
					<p @click="${this.logsListener}" class="menu-item">Logs</p>
					<p @click="${this.optionListener}" class="menu-item">Options</p>
				</div>
			</div>
			<p @click="${this.dashboardListener}" class="big-menu-item">Dashboard</p>
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
