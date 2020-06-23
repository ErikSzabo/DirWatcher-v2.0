import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import { extensions } from './styles.js';

/**
 * Component to edit sub folders extensions.
 */
export class ExtensionPopup extends LitElement {
	constructor() {
		super();
		this.extensions = [];
	}

	static get properties() {
		return {
			extensions: { type: Array },
			subID: { type: String }
		};
	}

	render() {
		return html`
        <div @click="${this.exitPopup}" class="popup overlay">
            <div class="content">
                <div @click="${this.exitPopup}" class="cancel exit">
                    <div class="line1 exit"></div>
                    <div class="line2 exit"></div>
                </div>
                <div class="title">Extensions editor</div>
                <div class="description">Enter your file extensions (separated by comas)</div>
                <div class="form">
                    <input type="text" placeholder="jpg, png, gif" value="${this.extensions.join(', ')}">
                    <div @click="${this.save}" class="button">Save</div>
                </div>
                <div class="footer">
                    Click anywhere out of this popup to exit.
                </div>
            </div>
        </div>
         `;
	}

	static get styles() {
		return extensions();
	}

	/**
     * Closes the popup, if user clicked on the X or anywhere
     * out of the popup.
     * 
     * @param {*} e dom event
     */
	exitPopup = (e) => {
		if (e.target.classList.contains('exit') || e.target.classList.contains('overlay')) {
			this.remove();
		}
	};

	/**
     * Saves the new file extensions.
     */
	save = () => {
		// Get the user input extensions
		const extensions = formatExtensions(this.shadowRoot.querySelector('input').value);
		// Send to the controller to save, and remove the popup
		require('electron').ipcRenderer.send('extensions:save', this.subID, extensions);
		this.remove();
	};
}

/**
 * Formats the give extensions.
 * - nothing or just spaces should be an empty array
 * - just one word without comas should be a one element array
 * - if there are comas, then split them into an array by comas.
 * 
 * @param {*} extensions user input extensions
 */
function formatExtensions(extensions) {
	let newExts = [];

	if (extensions.trim() === '') {
		return newExts;
	} else if (extensions.includes(',')) {
		// If there is multiple, split by comas
		newExts = extensions.split(',');
	} else {
		// If there is only one, make it an array
		newExts = [ extensions ];
	}
	// trim the spaces
	newExts = newExts.map((el) => el.trim());
	return newExts;
}
