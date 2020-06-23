import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import { indexItem, indexPage } from './styles.js';

/**
 * Index/Welcome page component. This is the first view
 * that will the user see.
 */
export class IndexPage extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return indexPage();
	}

	render() {
		return html`
			<div>
				<h1>Welcome to DirWatcher!</h1>
				<slot />
			</div>
		`;
	}
}

/**
 * Component for list elements in the index page.
 * Like author, github link etc.
 */
export class IndexPageElement extends LitElement {
	constructor() {
		super();
	}

	static get properties() {
		return {
			url: { type: String },
			name: { type: String }
		};
	}

	static get styles() {
		return indexItem();
	}

	render() {
		return html`
			<div class="w-container">
				<div class="colored-key">${this.name}</div>
				<a @click="${this.listener}" target="_blank" href="${this.url}">
					${this.url}
				</a>
			</div>
		`;
	}

	/**
	 * If the user click on the list element,
	 * external url will be opened.
	 * 
	 * @param {*} e dom event 
	 */
	listener = (e) => {
		e.preventDefault();
		require('electron').shell.openExternal(this.url);
	};
}
