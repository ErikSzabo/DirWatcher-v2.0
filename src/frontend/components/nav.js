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

	disconnectedCallback() {
		this.shadowRoot.querySelector('.logs-menu').removeEventListener('click');
		this.shadowRoot.querySelector('.options-menu').removeEventListener('click');
		this.shadowRoot.querySelector('.dashboard-menu').removeEventListener('click');
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
		this.shadowRoot.querySelector('.logs-menu').addEventListener('click', () => {});
	}

	addDashboardListener() {
		this.shadowRoot.querySelector('.dashboard-menu').addEventListener('click', () => {});
	}
}

window.customElements.define('c-nav', Nav);
