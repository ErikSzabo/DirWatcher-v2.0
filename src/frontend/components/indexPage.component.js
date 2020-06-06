const pageTemplate = document.createElement('template');
pageTemplate.innerHTML = `
    <style>
        .index-container {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 465px;
            transform: translate(-50%, -50%);
        }
        
        .welcome {
            font-size: 40px;
            width: 465px;
        }
    </style>

    <div class="index-container">
        <h1 class="welcome">Welcome to DirWatcher!</h1>
        <slot />
    </div>
`;

const pageElementTemplate = document.createElement('template');
pageElementTemplate.innerHTML = `
    <style>
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
        
        .colored-value {
            color: var(--blue);
            display: inline;
            font-size: 13px;
            margin-left: 20px;
            text-decoration: none;
        }
    </style>

    <div class="w-container">
        <div class="colored-key"></div>
        <a href="#" class="colored-value"></a>
    </div>
`;

class IndexPage extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(pageTemplate.content.cloneNode(true));
	}
}

class IndexPageElement extends HTMLElement {
	constructor() {
		super();

		const url = this.getAttribute('url');
		const key = this.getAttribute('name');

		this.attachShadow({ mode: 'open' });

		// TODO: a tag helyett main process shell-nek kell küldeni, hogy default browserben nyissa meg!
		this.shadowRoot.appendChild(pageElementTemplate.content.cloneNode(true));
		this.shadowRoot.querySelector('.colored-value').href = url;
		this.shadowRoot.querySelector('.colored-value').innerHTML = url;
		this.shadowRoot.querySelector('.colored-key').innerHTML = key;
	}
}

window.customElements.define('index-page', IndexPage);
window.customElements.define('index-page-element', IndexPageElement);
