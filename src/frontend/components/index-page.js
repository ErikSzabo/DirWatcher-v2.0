class IndexPage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/index-page.css";</style>

            <div class="index-container">
                <h1 class="welcome">Welcome to DirWatcher!</h1>
                <slot />
            </div>
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
}

class IndexPageElement extends HTMLElement {
	constructor() {
		super();
		this.url = this.getAttribute('url');
		this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/index-page-element.css";</style>

            <div class="w-container">
                <div class="colored-key">${this.getAttribute('name')}</div>
				<a target="_blank" href="${this.url}" class="colored-value">
					${this.url}
				</a>
            </div>
        `;

		// TODO: a tag helyett main process shell-nek kell küldeni, hogy default browserben nyissa meg!
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.querySelector('a').addEventListener('click', this.listener);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('a').removeEventListener('click', this.listener);
	}

	listener = (e) => {
		e.preventDefault();
		require('electron').shell.openExternal(this.url);
	};
}

window.customElements.define('index-page', IndexPage);
window.customElements.define('index-page-element', IndexPageElement);
