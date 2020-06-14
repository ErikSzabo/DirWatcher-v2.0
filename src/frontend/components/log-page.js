import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

export class LogItem extends LitElement {
	constructor() {
		super();
	}

	static get properties() {
		return {
			name: { type: String },
			dateString: { type: String }
		};
	}

	static get styles() {
		return css`
			.w-container {
				margin: 10px auto;
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

			.colored-value {
				color: var(--blue);
				display: inline;
				font-size: 13px;
				margin-left: 20px;
			}
		`;
	}

	render() {
		return html`
		<div @click="${this.listener}" class="w-container">
            <div class="colored-key">${this.dateString}</div>
            <p class="colored-value">${this.name}</p>
		</div>
		`;
	}

	listener() {
		// TODO: main processnek elküldeni a nevét, hogy nyissa meg a fájlt.
	}
}

export class LogPage extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return css`
			.container {
				width: 90%;
				margin: auto;
				margin-top: 20px;
			}

			.start {
				width: 90%;
				margin-bottom: 20px;
				display: flex;
				align-items: center;
			}

			.open {
				float: left;
				width: 100px;
				padding: 8px;
				background-color: var(--custom-black);
				color: white;
				font-size: 14px;
				cursor: pointer;
				display: block;
				margin-right: 20px;
			}
		`;
	}

	render() {
		return html`
		<div class="container">
            <div class="start">
                <div @click="${this.listener}" class="open">Open log folder</div>
                <p>Opens up the folder which holds the log files.</p>
            </div>
            <slot />
        </div>
		`;
	}

	listener() {
		require('electron').ipcRenderer.send('open:logs');
	}
}
