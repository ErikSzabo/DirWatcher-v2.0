class OptionItem extends HTMLElement {
	constructor() {
		super();
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
                            <option value="enabled">Enabled</option>
                            <option value="enabled" selected>Disabled</option>
                        </select>
                    </div>
                </div>
            </div> 
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.querySelector('#option-selector').addEventListener('change', () => {
			// TODO: this.getAttribute('id') üzenettel küldjön üzit a main processnek
			//       hogy módosítsa a beállítást
			// az id és az options.json key meg kell, hogy egyezzen
		});
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('#option-selector').removeEventListener('change');
	}
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
