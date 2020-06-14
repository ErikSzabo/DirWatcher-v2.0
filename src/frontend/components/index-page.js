import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

export class IndexPage extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return css`
			div {
				position: absolute;
				left: 50%;
				top: 50%;
				width: 465px;
				transform: translate(-50%, -50%);
			}

			h1 {
				font-size: 40px;
				width: 465px;
			}
		`;
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
		return css`
			.w-container {
				margin: auto;
				margin-top: 10px;
				width: 400px;
				height: 45px;
				border: 1px solid #b4b4b4;
				display: flex;
				align-items: center;
				background-color: white;
			}

			.colored-key {
				color: var(--blue);
				font-weight: bold;
				font-size: 13px;
				background-color: var(--light-blue);
				display: inline;
				padding: 8px;
				margin-left: 10px;
			}

			a {
				color: var(--blue);
				display: inline;
				font-size: 13px;
				margin-left: 20px;
				text-decoration: none;
			}
		`;
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

	listener = (e) => {
		e.preventDefault();
		require('electron').shell.openExternal(this.url);
	};
}
