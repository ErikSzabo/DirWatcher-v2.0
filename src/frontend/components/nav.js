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
					<option-item id="folder-monitoring" title="Folder Monitoring">
						Enables folder monitoring, which means, you can keep track of the changes 
						in your watched folders. New log file will be created in every new day. You can 
						view logs in the logs folder or at the logs page.
					</option-item>
					<option-item id="auto-start" title="Auto Start">
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
		this.shadowRoot.querySelector('.dashboard-menu').addEventListener('click', () => {
			// TODO: make this dynamic
			document.querySelector('main').innerHTML = `
				<dashboard-page>
					<root-folder name="Downloads" id="3456HFJK3F35FJ">
						<sub-folder class="hide" name="test" parent-id="3456HFJK3F35FJ" id="0"></sub-folder>
						<sub-folder class="hide" name="test2" parent-id="3456HFJK3F35FJ" id="1"></sub-folder>
						<sub-folder class="hide" name="test3" parent-id="3456HFJK3F35FJ" id="2"></sub-folder>
					</root-folder>
					<root-folder name="Desktop" id="3456HFJK3F35FK"></root-folder>
					<root-folder name="Videos" id="3456HFJK3F35FL">
						<sub-folder class="hide" name="test" parent-id="3456HFJK3F35FL" id="3"></sub-folder>
					</root-folder>
				</dashboard-page>
			`;
		});
	}
}

window.customElements.define('c-nav', Nav);
