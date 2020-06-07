class Nav extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
			<style>@import "../frontend/component_styles/nav.css";</style>

			<nav class="nav-menu">
				<div class="nav-title nav-item"><div>DirWatcher <span>v2.0</span></div></div>
				<div class="nav-btns nav-item">
					<p class="menu-item logs-menu">Logs</p>
					<p class="menu-item options-menu">Options</p>
					<p class="menu-item dashboard-menu">Dashborad</p>
				</div>
			</nav>
		`;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.addIndexListener();
		this.addOptionListener();
		this.addLogsListener();
		this.addDashboardListener();
	}

	addIndexListener() {
		this.shadowRoot.querySelector('.nav-title').addEventListener('click', () => {
			document.querySelector('main').innerHTML = `
				<index-page>
					<index-page-element name="github" url="https://github.com/ErikSzabo/digital-circuitsv2.0"></index-page-element>
					<index-page-element name="author" url="https://github.com/ErikSzabo"></index-page-element>
				</index-page>
			`;
		});
	}

	addOptionListener() {
		this.shadowRoot.querySelector('.options-menu').addEventListener('click', () => {
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
		});
	}

	addLogsListener() {
		this.shadowRoot.querySelector('.logs-menu').addEventListener('click', () => {
			// TODO: make this dynamic
			document.querySelector('main').innerHTML = `
				<log-page>
					<log-list-item name="test log file name" date-string="2020/06/06"></log-list-item> 
					<log-list-item name="test log file name" date-string="2020/06/06"></log-list-item> 
					<log-list-item name="test log file name" date-string="2020/06/06"></log-list-item> 
    			</log-page>
			`;
		});
	}

	addDashboardListener() {
		this.shadowRoot.querySelector('.dashboard-menu').addEventListener('click', async () => {
			const { ipcRenderer } = require('electron');
			const rootData = await ipcRenderer.invoke('get:all:root');
			const subData = await ipcRenderer.invoke('get:all:sub');
			let html = '<dashboard-page id="dashboard">';

			for (let root of rootData) {
				html += `<root-folder name="${root.name}" id="${root._id}"></root-folder>`;
				for (let sub of subData) {
					if (sub.parentID === root._id) {
						html += `<sub-folder class="hide" name="${sub.name}" parent-id="${root._id}" id="${sub._id}"></sub-folder>`;
					}
				}
				html += '</root-folder>';
			}

			html += '</dashboard-page>';

			document.querySelector('main').innerHTML = html;
		});
	}
}

window.customElements.define('c-nav', Nav);
