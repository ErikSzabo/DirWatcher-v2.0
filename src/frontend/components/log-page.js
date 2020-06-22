import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import { logItem, logPage } from './styles.js';

/**
 * Component to display logs inside the logs folder.
 */
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
		return logItem();
	}

	render() {
		return html`
		<div @click="${this.listener}" class="w-container">
            <div class="colored-key">${this.dateString}</div>
            <p>${this.name}</p>
		</div>
		`;
	}

	listener() {
		// TODO: send msg to the main controller to open up the selected log.
	}
}

/**
 * Component to display the default logs page.
 * User can open up the logs folder from here.
 */
export class LogPage extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return logPage();
	}

	render() {
		return html`
		<div class="container">
            <div class="start">
                <div @click="${this.listener}" class="open">Open log folder</div>
                <p>Opens up the folder which holds the log files.</p>
			</div>
			<div class="logs">
				<slot />
			</div>
        </div>
		`;
	}

	/**
	 * Listener called when user clicks on "open logs folder"
	 * in the logs page. It will open up the logs folder which
	 * stores all the logs.
	 */
	listener() {
		require('electron').ipcRenderer.send('open:logs');
	}
}
