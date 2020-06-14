class LogItem extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/log-list-item.css";</style>

            <div class="w-container">
                <div class="colored-key">${this.getAttribute('date-string')}</div>
                <p class="colored-value">${this.getAttribute('name')}</p>
            </div>
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.querySelector('.w-container').addEventListener('click', this.listener);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('.w-container').removeEventListener('click', this.listener);
	}

	listener() {
		// TODO: main processnek elküldeni a nevét, hogy nyissa meg a fájlt.
	}
}

class LogPage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/log-page.css";</style>

            <div class="container">
                <div class="start">
                    <div class="open">Open log folder</div>
                    <p>Opens up the folder which holds the log files.</p>
                </div>
                <slot />
            </div>
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.querySelector('.open').addEventListener('click', this.listener);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('.open').removeEventListener('click', this.listener);
	}

	listener() {
		require('electron').ipcRenderer.send("open:logs");
	}
}

window.customElements.define('log-list-item', LogItem);
window.customElements.define('log-page', LogPage);
