import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

export class OptionItem extends LitElement {
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
			title: { type: String }
		};
	}

	static get styles() {
		return css`
			.title {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 5px;
			}

			.description {
				font-size: 14px;
				text-align: justify;
			}

			.item {
				flex-direction: column;
				margin: 40px 0;
			}

			#option-selector {
				width: 100px;
				padding: 3px;
				margin-top: 5px;
				position: relative;
				left: 0;
			}
		`;
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

	listener = () => {
		const key = this.id;
		const value = this.shadowRoot.querySelector('#option-selector').value === 'e' ? true : false;
		require('electron').ipcRenderer.send('change:options', { key, value });
	};
}

export class OptionsPage extends LitElement {
	constructor() {
		super();
	}

	static get styles() {
		return css`
			.container {
				width: 90%;
				position: absolute;
				left: 50%;
				top: 70px;
				transform: translateX(-50%);
			}
		`;
	}

	render() {
		return html`
			<div class="container">
				<slot />
			</div>
		`;
	}
}
