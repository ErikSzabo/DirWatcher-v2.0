import { Nav } from './nav.js';
import { OptionItem, OptionsPage } from './options-page.js';
import { IndexPage, IndexPageElement } from './index-page.js';
import { RootFolder, SubFolder, DashboradPage } from './dashboard-page.js';
import { LogItem, LogPage } from './log-page.js';

window.customElements.define('c-nav', Nav);
window.customElements.define('options-page', OptionsPage);
window.customElements.define('option-item', OptionItem);
window.customElements.define('index-page', IndexPage);
window.customElements.define('index-page-element', IndexPageElement);
window.customElements.define('dashboard-page', DashboradPage);
window.customElements.define('root-folder', RootFolder);
window.customElements.define('sub-folder', SubFolder);
window.customElements.define('log-list-item', LogItem);
window.customElements.define('log-page', LogPage);
