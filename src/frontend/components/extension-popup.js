import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

const categories = {
    images: ["jpg", "png", "gif", "psd", "bmp", "ico", "svg"],
    musics: ["mp3", "wav"],
    videos: ["mp4", "avi", "mkv"],
    documents: ["doc", "docx", "pdf", "ppt", "xls"],
    programming: ["java", "py", "js", "css", "html", "c", "h"]
}

export class ExtensionPopup extends LitElement {
    constructor() {
        super();
        this.extensions = [];
    }

    static get properties() {
        return {
            extensions: { type: Array },
            subID: { type: String }
        }
    }

    render() {
        return html`
        <div @click="${this.exitPopup}" class="overlay">
            <div class="container">
                <h3>Extension Manager</h3>
                <h5>Current extensions: ${this.extensions.join(", ")}</h5>
                <p>Assigning extensions to a subfolder means that, every file with the given extensions placed in the root folder, will be moved to the subfolder if possible.</p>
                <p>Write your extensions here (separated by comas):</p>
                <input type="text" value="${this.extensions.join(", ")}" placeholder="png, jpg, gif">
                <div class="buttons">
                    <div @click="${this.save}" class="save btn">Save</div>
                    <div @click="${this.exitPopup}" class="cancel btn">Cancel</div>
                </div>
            </div>
        </div>
         `;
    }

    static get styles() {
        return css`
            .overlay {
                position: absolute;
                top: 75px;
                width: 100vw;
                height: calc(100vh - 75px);
                background-color: rgba(0, 0, 0, 0.8); 
            }

            .container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                height: 320px;
                padding: 20px;
                background: var(--light-blue);
                text-align: justify;
            }

            .buttons {
                display: flex;
            }

            .btn {
                width: 80px;
                padding: 5px;
                cursor: pointer;
                margin-right: 10px; 
                text-align: center;
            }

            .save {
                background: lightblue;
            }

            .cancel {
                background: gray;
            }

            input {
                margin-bottom: 10px;
            }
        `;
    }

    exitPopup = (e) => {
        if (e.target.classList.contains('cancel') || e.target.classList.contains('overlay')) {
            this.remove();
        }
    }

    save = () => {
        // Get the user input extensions
        let extensions = this.shadowRoot.querySelector('input').value;
        if (extensions.includes(',')) {
            // If there is multiple, split by comas
            extensions = extensions.split(',');
        } else {
            // If there is only one, make it an array
            extensions = [extensions];
        }
        // trim the spaces
        extensions = extensions.map(el => el.trim());
        // Send to the controller to save, and remove the popup
        require('electron').ipcRenderer.send('extensions:save', this.subID, extensions);
        this.remove();
    }

}