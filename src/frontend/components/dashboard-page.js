class DashboradPage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/dashboard-page.css";</style>

            <div class="container">
                <p>Add root folder</p>
                <div class="start">
                    <input type="text" placeholder="Absolute/path/to/folder/click/browse">
                    <div class="btn browse">Browse</div>
                    <div class="btn add">Add</div>
                </div>
                <slot />
            </div>
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.querySelector('.browse').addEventListener('click', this.browseListener);
		this.shadowRoot.querySelector('.add').addEventListener('click', this.addListener);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('.browse').removeEventListener('click', this.browseListener);
		this.shadowRoot.querySelector('.add').removeEventListener('click', this.addListener);
	}

	browseListener = () => {
		require('electron').ipcRenderer.invoke('open:explorer').then((path) => {
			if (!path) return;
			this.shadowRoot.querySelector('input').value = path;
		});
	};

	addListener = () => {
		// TODO: main processnek elküldeni, hogy szortírozza a mappákat.
	};
}

class RootFolder extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.name = this.getAttribute('name');
		// This element should always has an id which is identical to
		// its neDB database id

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/root-folder.css";</style>

            <div class="container">
                <div class="start">
                    <div class="name">${this.name}</div>
                    <div class="btn organize">Organize</div>
                    <div class="btn add">Add Sub</div>
                    <div class="btn delete">Delete</div>
                </div>
                <slot />
            </div>
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.querySelector('.name').addEventListener('click', this.toggleListener);
		this.shadowRoot.querySelector('.organize').addEventListener('click', this.organizeListener);
		this.shadowRoot.querySelector('.add').addEventListener('click', this.addListener);
		this.shadowRoot.querySelector('.delete').addEventListener('click', this.deleteListener);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('.name').removeEventListener('click', this.toggleListener);
		this.shadowRoot.querySelector('.organize').removeEventListener('click', this.organizeListener);
		this.shadowRoot.querySelector('.add').removeEventListener('click', this.addListener);
		this.shadowRoot.querySelector('.delete').removeEventListener('click', this.deleteListener);
	}

	organizeListener = () => {
		// TODO: Send msg to main to handle folder organizing
	};
	addListener = () => {
		// TODO: Send msg to main to add root folder to the database
	};
	deleteListener = () => {
		// TODO: Send msg to main to delete the folder from the database
	};
	toggleListener = () => {
		for (let child of this.children) {
			child.classList.toggle('hide');
		}
	};
}

class SubFolder extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.name = this.getAttribute('name');
		this.parentID = this.getAttribute('parent-id');
		this.id = this.getAttribute('id');
		// This element should always has an id which is identical to
		// its neDB database id as well as its parent id

		const template = document.createElement('template');
		template.innerHTML = `
            <style>@import "../frontend/component_styles/sub-folder.css";</style>

            <div class="w-container">
                <div class="colored-key">sub-folder</div>
                <p class="colored-value">${this.name}</p>
                <div class="buttons">
                    <div class="ext">Extensions</div>
                    <div class="delete">Delete</div>
                </div>
            </div>
        `;

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.querySelector('.ext').addEventListener('click', this.extListener);
		this.shadowRoot.querySelector('.delete').addEventListener('click', this.deleteListener);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('.ext').removeEventListener('click', this.extListener);
		this.shadowRoot.querySelector('.delete').removeEventListener('click', this.deleteListener);
	}

	extListener = () => {
		// TODO: Send msg to main to open new window which opens a new window for editing
	};
	deleteListener = () => {
		// TODO: Send msg to main to delete the folder from the database
	};
}

window.customElements.define('dashboard-page', DashboradPage);
window.customElements.define('root-folder', RootFolder);
window.customElements.define('sub-folder', SubFolder);
