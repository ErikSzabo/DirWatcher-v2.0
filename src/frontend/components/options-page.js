import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import { optionPage, optionItem } from './styles.js';

/**
 * Component for options. These options will go inside
 * the options page. For now this only features true and
 * false option states.
 * id should be identical to the options.json key.
 */
export class OptionItem extends LitElement {
	/**
	 * Based on options.json enable or disable will
	 * load dinamically.
	 */
	constructor() {
		super();
		require('electron').ipcRenderer.invoke('get:options').then((options) => {
			this.shadowRoot.querySelector('#option-selector').innerHTML = `
				<option value="d">Disabled</option>
				<option value="e" ${options[this.id] ? 'selected' : ''}>Enabled</option>
			`;
		});
	}

	static get properties() {
		return {
			title: { type: String },
			id: { type: String }
		};
	}

	static get styles() {
		return optionItem();
	}

	render() {
		return html`
			<div class="item">
				<div class="title">${this.title}</div>
				<div class="sub">
					<div class="description">
						<slot />
					</div>
					<div class="btn-selector">
						<select @change="${this.listener}" id="option-selector">
							
						</select>
					</div>
				</div>
			</div> 
		`;
	}

	/**
	 * Listener will be called when user change from enable to diasble
	 * and vice versa. Will send a message to to main controller, which will
	 * handle the change.
	 */
	listener = () => {
		const key = this.id;
		const value = this.shadowRoot.querySelector('#option-selector').value === 'e' ? true : false;
		require('electron').ipcRenderer.send('change:options', { key, value });
	};
}

/**
 * Component for the options page. Will be loaded
 * when user clicks on options in the navigation.
 * Holds all of the options.
 */
export class OptionsPage extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return optionPage();
	}

	render() {
		return html`
			<div class="container">
				<option-item id="folderMonitoring" title="Folder Monitoring">
					Enables folder monitoring, which means, you can keep track of the changes 
					in your watched folders. New log file will be created in every new day. You can 
					view logs in the logs folder or at the logs page.
				</option-item>
				<option-item id="autoStart" title="Auto Start">
					You can start DirWatcher instantly when your operating system loaded up.
				</option-item>
				<option-item id="autoWatchRoot" title="Auto watch for root folders">
					Automatically start watching the root folders,
					this includes folder monitoring (if enabled) and
					folder organizing.
				</option-item>
				<option-item id="autoWatchSub" title="Auto watch for sub folders">
					Automatically start watching the sub folders. Sub
					folders can only use folder monitoring, so if that is
					not enabled, this options wouldn't change anything
					from a user perspective.
				</option-item>
			</div>
		`;
	}
}
