const optionsTemplate = document.createElement('template');
optionsTemplate.innerHTML = `
	<style>
        .container {
            width: 90%;
            position: absolute;
            left: 50%;
            top: 70px;
            transform: translateX(-50%);
        }
	</style>

	<div class="container">
      <slot />
    </div>
`;

const optionItemTemplate = document.createElement('template');
optionItemTemplate.innerHTML = `
    <style>
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
    </style>

    <div class="item">
        <div class="title"></div>
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

class OptionItem extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(optionItemTemplate.content.cloneNode(true));
		this.shadowRoot.querySelector('.title').innerHTML = this.getAttribute('title');
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
		this.shadowRoot.appendChild(optionsTemplate.content.cloneNode(true));
	}
}

window.customElements.define('options-page', OptionsPage);
window.customElements.define('option-item', OptionItem);
