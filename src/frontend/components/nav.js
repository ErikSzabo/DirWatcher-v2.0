import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import { nav } from './styles.js';

/**
 * Main navigation of the application.
 * Contains navigation for the following pages:
 * - Logs
 * - Options
 * - Dashboard
 * - Index
 */
export class Nav extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return nav();
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

	/**
	 * Will be called when user clicks on the logo.
	 * It will load the index/welcome page.
	 */
	indexListener() {
		document.querySelector('main').innerHTML = `
				<index-page>
					<index-page-element name="github" url="https://github.com/ErikSzabo/DirWatcher-v2.0"></index-page-element>
					<index-page-element name="author" url="https://github.com/ErikSzabo"></index-page-element>
				</index-page>
		`;
	}

	/**
	 * Will be called when user clicks on the options button.
	 * It will load the options page.
	 */
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

	/**
	 * Will be called when user clicks on the logs button.
	 * It will load the logs page.
	 */
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

	/**
	 * Will be called when user clicks on the dashboard button.
	 * It will load the dashboard page.
	 */
	async dashboardListener() {
		const { ipcRenderer } = require('electron');
		const rootData = await ipcRenderer.invoke('get:all:root');
		const subData = await ipcRenderer.invoke('get:all:sub');
		let html = '<dashboard-page id="dashboard">';

		for (const root of rootData) {
			html += `<root-folder name="${root.name}" id="${root._id}" path="${root.path}">`;
			for (const sub of subData) {
				if (sub.parentID === root._id) {
					html += `<sub-folder class="hide" name="${sub.name}" parentID="${root._id}" id="${sub._id}" path="${sub.path}"></sub-folder>`;
				}
			}
			html += '</root-folder>';
		}

		html += '</dashboard-page>';

		document.querySelector('main').innerHTML = html;
	}
}
