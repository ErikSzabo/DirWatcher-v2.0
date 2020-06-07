class OptionItem extends HTMLElement {
	constructor() {
		super();
		this.id = this.getAttribute('id');

		this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/option-list-item.css";</style>
        
            <div class="item">
                <div class="title">${this.getAttribute('title')}</div>
                <div class="sub">
                    <div class="description">
                        <slot />
                    </div>
                    <div class="btn-selector">
						<select id="option-selector">
							
                        </select>
                    </div>
                </div>
            </div> 
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		require('electron').ipcRenderer.invoke('get:options').then((options) => {
			this.shadowRoot.querySelector('#option-selector').innerHTML = `
				<option value="d">Disabled</option>
				<option value="e" ${options[this.id] ? 'selected' : ''}>Enabled</option>
			`;
		});
		this.shadowRoot.querySelector('#option-selector').addEventListener('change', this.listener);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('#option-selector').removeEventListener('change', this.listener);
	}

	listener = () => {
		const key = this.id;
		const value = this.shadowRoot.querySelector('#option-selector').value === 'e' ? true : false;
		require('electron').ipcRenderer.send('change:options', { key, value });
	};
}

class OptionsPage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/options-page.css";</style>

            <div class="container">
                <slot />
            </div>
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
}

window.customElements.define('options-page', OptionsPage);
window.customElements.define('option-item', OptionItem);
