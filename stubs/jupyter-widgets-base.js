// webapp/stubs/jupyter-widgets-base.js
console.log('Using STUB for @jupyter-widgets/base');

export class DOMWidgetView {
    constructor(options = {}) {
        console.log('STUB DOMWidgetView constructor', options);
        this.el = options.el || document.createElement('div');
        this.model = options.model || new DOMWidgetModel({}, { view: this });
        this.options = options; // Store options for later use
        // `cid` is often used for unique identification, let's stub it
        this.cid = `stubview_${Math.random().toString(36).substr(2, 9)}`;


        // If the widget expects a `luminoWidget` property (common with newer JupyterLab widgets)
        // this.luminoWidget = { node: this.el, id: this.cid, title: { icon: '', caption: ''}, addClass: (c)=>{this.el.classList.add(c)},removeClass:(c)=>{this.el.classList.remove(c)} };
    }

    render() {
        console.log('STUB DOMWidgetView render called for', this.cid);
        // Default implementation: many widgets call super.render()
        // or expect this.el to be available and attached.
        // If your widget's render method does something specific to attach to DOM,
        // it should handle that.
        return this;
    }

    remove() {
        console.log('STUB DOMWidgetView remove called for', this.cid);
        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
        // Call model.close() if view is removed. Mimics Jupyter behavior
        // and helps clean up model listeners if model is shared.
        if (this.model) {
            this.model.close(true); // Pass true to indicate view initiated close
        }
    }

    // Common methods that might be called by the widget
    displayed() {
        console.log('STUB DOMWidgetView displayed promise');
        return Promise.resolve();
    }

    processPhosphorMessage(msg) {
        console.log('STUB DOMWidgetView processPhosphorMessage', msg);
        // Handle common messages like 'after-attach' or 'before-detach' if needed
        // if (msg.type === 'after-attach') {
        //    this.trigger('displayed');
        // }
    }

    // `trigger` is often used to emit events.
    // Basic Backbone-like event triggering
    on(eventName, callback, context) {
        this._events = this._events || {};
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push({ callback, context: context || this });
    }

    off(eventName, callback) {
        this._events = this._events || {};
        if (!eventName) { // remove all
            this._events = {};
            return;
        }
        if (!this._events[eventName]) return;

        if (!callback) { // remove all for this event
            this._events[eventName] = [];
        } else {
            this._events[eventName] = this._events[eventName].filter(
                e => e.callback !== callback
            );
        }
    }

    trigger(eventName, ...args) {
        this._events = this._events || {};
        if (this._events[eventName]) {
            this._events[eventName].forEach(event => {
                event.callback.apply(event.context, args);
            });
        }
    }

    // Add other methods like .send, .touch, etc., as needed based on errors.
    send(content, callbacks, buffers) {
        console.log('STUB DOMWidgetView send', content, callbacks, buffers);
        // This would typically be handled by the model, but views sometimes call it.
        if (this.model) {
            this.model.send(content, callbacks, buffers);
        }
    }
}

export class DOMWidgetModel {
    constructor(attributes = {}, options = {}) {
        console.log('STUB DOMWidgetModel constructor', attributes, options);
        this.cid = `stubmodel_${Math.random().toString(36).substr(2, 9)}`;
        this._attributes = { ...this.defaults(), ...attributes };
        this._events = {};
        this.views = {}; // To keep track of associated views
        this.widget_manager = options.widget_manager || { get_model: () => Promise.resolve(null) /* more stubs needed here */ };
        this.state_change = Promise.resolve(); // often used
        this.comm = null; // Jupyter comm object, will be null/unused in standalone

        // if (options.view) {
        //     this.views[options.view.cid] = Promise.resolve(options.view);
        // }
    }

    defaults() {
        return {
            _model_name: this.constructor.model_name || 'DOMWidgetModel',
            _model_module: this.constructor.model_module || '@jupyter-widgets/base',
            _model_module_version: this.constructor.model_module_version || JUPYTER_WIDGETS_VERSION,
            _view_name: this.constructor.view_name || null,
            _view_module: this.constructor.view_module || null,
            _view_module_version: this.constructor.view_module_version || JUPYTER_WIDGETS_VERSION,
            _view_count: null, // Number of views
        };
    }

    get(key) {
        return this._attributes[key];
    }

    set(key, value, options = {}) {
        // console.log(`STUB DOMWidgetModel set ${key}`, value);
        const old_value = this._attributes[key];
        this._attributes[key] = value;
        if (old_value !== value || (options && options.forceUpdate)) {
            this.trigger(`change:${key}`, this, value);
            this.trigger('change', this, options); // Pass options to change event
        }
    }

    on(eventName, callback, context) {
        this._events = this._events || {};
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push({ callback, context: context || this });
    }

    off(eventName, callback) {
        this._events = this._events || {};
        if (!eventName) { this._events = {}; return; }
        if (!this._events[eventName]) return;
        if (!callback) { this._events[eventName] = []; }
        else {
            this._events[eventName] = this._events[eventName].filter(
                e => e.callback !== callback
            );
        }
    }

    trigger(eventName, ...args) {
        this._events = this._events || {};
        if (this._events[eventName]) {
            this._events[eventName].forEach(event => {
                event.callback.apply(event.context, args);
            });
        }
        if (eventName === 'comm_live_update') { // Special handling if your widget uses this.
             this.state_change = this.state_change.then(()=> this.send_state());
        }
    }

    send(content, callbacks, buffers) {
        console.log('STUB DOMWidgetModel send', content, callbacks, buffers);
        // In a real app, this is where you'd make an HTTP request to your Python backend.
        // For example:
        // fetch('/api/widget_message', {
        //  method: 'POST',
        //  headers: { 'Content-Type': 'application/json' },
        //  body: JSON.stringify({ model_id: this.model_id, content: content })
        // })
        // .then(response => response.json())
        // .then(data => { if (callbacks && callbacks.iopub && callbacks.iopub.output) callbacks.iopub.output(data); })
        // .catch(error => { if (callbacks && callbacks.iopub && callbacks.iopub.error) callbacks.iopub.error(error); });
    }

    toJSON(options) {
        return { ...this._attributes };
    }

    isNew() {
        return this.model_id == null; // model_id is typically set by the manager
    }

    save_changes(callbacks) {
        console.log('STUB DOMWidgetModel save_changes');
        // This is where the model would typically sync its state to the backend.
        // We might trigger a 'sync' event.
        this.trigger('sync', this);
    }

    close(comm_closed = false) {
        console.log('STUB DOMWidgetModel close. Comm closed:', comm_closed);
        this.trigger('destroy', this); // Trigger destroy event for views to clean up.
        this.off(); // Remove all listeners
        // In a real widget, it might also close its comm if not already closed.
        return Promise.resolve();
    }

    // For _view_count handling
    static serializers = {
        ...DOMWidgetModel.serializers, // if base class has some
    };

    // Required static properties (can be overridden by your actual widget model)
    static model_name = 'DOMWidgetModel';
    static model_module = '@jupyter-widgets/base';
    static model_module_version = '1.2.0'; // Or your target ipywidgets version
    static view_name = null; // Usually overridden
    static view_module = null; // Usually overridden
    static view_module_version = '1.2.0';

    // Method to handle messages from backend (not used if backend doesn't push)
    _handle_comm_msg(msg) {
        const content = msg.content.data;
        if (content.method === 'update') {
            this.set_state(content.state);
        } else if (content.method === 'custom') {
            this.trigger('msg:custom', content.content, msg.buffers);
        }
    }

    set_state(state) {
        // More complex state setting might be needed depending on serializers
        for (const key in state) {
            this.set(key, state[key]);
        }
    }

    get_state(key) {
        // More complex state getting might be needed
        return { ...this._attributes };
    }
    send_state(keys) {
      // this mimics sending the state.
      this.save_changes();
    }
}

// If your widget uses ViewList to manage multiple views for a model:
export class ViewList {
    constructor(view_constructor, model) {
        this._view_constructor = view_constructor;
        this._model = model;
        this._views = []; // Array of promises to views
    }
    update(views) { // views is an array of DOM elements
        const new_views_promises = views.map(el => {
            const options = { model: this._model, el: el };
            const view = new this._view_constructor(options);
            view.render(); // Render the view
            // Simulate display promise
            view.trigger('displayed');
            return Promise.resolve(view);
        });
        this._views = new_views_promises; // Replace old views
        return Promise.all(this._views);
    }
    remove() {
        return Promise.all(this._views).then(views_resolved => {
            views_resolved.forEach(view => view.remove());
            this._views = [];
        });
    }
    // Other methods like `insert`, `length`, etc. if needed
}


// If your widget uses versioning constants:
export const JUPYTER_WIDGETS_VERSION = '1.2.0'; // Align with ipywidgets version you are targeting
export const PROTOCOL_VERSION = '2.1.0'; // Align with ipywidgets version

// For handling data like layout, style, etc.
// These are often separate models in ipywidgets
export class LayoutModel extends DOMWidgetModel {
    static model_name = 'LayoutModel';
    defaults() {
        return {...super.defaults(), ...{
            _model_name: 'LayoutModel',
            // Add default layout properties if your widget reads them
            // e.g. width: null, height: null, border: null, etc.
        }};
    }
}
export class StyleModel extends DOMWidgetModel {
    static model_name = 'StyleModel';
     defaults() {
        return {...super.defaults(), ...{
            _model_name: 'StyleModel',
            // Add default style properties
        }};
    }
}

// Placeholder for a widget manager if complex interactions are needed
// (e.g., creating other widgets by model_id)
export const ManagerBase = {
    async get_model(model_id) { return null; },
    async new_widget(model_data, options) { return new DOMWidgetModel(model_data.state, options); },
    async create_view(model, options) { return new DOMWidgetView({model, ...options}); },
    async display_view(msg, view, options) {
        // This is where a view would typically be added to the DOM in a Jupyter context
        // For standalone, your main application script will do this.
        // document.body.appendChild(view.el);
        // view.trigger('displayed');
        return view;
    },
    async loadClass(className, moduleName, moduleVersion) {
        if (moduleName === '@jupyter-widgets/base') {
            if (className === 'LayoutModel') return LayoutModel;
            if (className === 'StyleModel') return StyleModel;
            if (className === 'DOMWidgetModel') return DOMWidgetModel;
            if (className === 'DOMWidgetView') return DOMWidgetView;
        }
        console.error(`STUB ManagerBase: Cannot load class ${className} from ${moduleName}`);
        return null;
    }
};

// A very simple alternative to provide some of the manager functionalities if needed by your widget
export class StubWidgetManager {
    constructor() {
        this.models = {}; // model_id: model_instance
    }

    async get_model(model_id) {
        return this.models[model_id];
    }

    async new_widget(model_data, options = {}) {
        console.log('StubWidgetManager.new_widget received model_data:', JSON.parse(JSON.stringify(model_data)));
        let model_name_from_data = model_data.model_name;
        let model_module_from_data = model_data.model_module;
        
        let ModelClass = DOMWidgetModel; // Default to DOMWidgetModel (our stub)
        console.log('Initial ModelClass:', ModelClass.name);

        const expectedModule = window.IpypetrinetWebApp && window.IpypetrinetWebApp.version ? window.IpypetrinetWebApp.version.MODULE_NAME : 'ipypetrinet';
        const expectedModelName = window.IpypetrinetWebApp && window.IpypetrinetWebApp.PetriModel ? window.IpypetrinetWebApp.PetriModel.model_name : 'PetriModel';

        console.log(`Comparing with: expectedModule='${expectedModule}', expectedModelName='${expectedModelName}'`);
        console.log(`Received: model_module_from_data='${model_module_from_data}', model_name_from_data='${model_name_from_data}'`);

        if (model_module_from_data === expectedModule && model_name_from_data === expectedModelName) {
            console.log('Condition to use custom PetriModel met.');
            ModelClass = window.IpypetrinetWebApp.PetriModel || DOMWidgetModel;
        } else {
            console.log('Condition to use custom PetriModel NOT met. Using default DOMWidgetModel stub.');
        }
        console.log('Final ModelClass to be instantiated:', ModelClass.name);

        const model = new ModelClass(model_data.state, { widget_manager: this, ...options });
        if (model_data.model_id) {
            model.model_id = model_data.model_id; 
            this.models[model.model_id] = model;
        }
        console.log('Constructed model instance type:', model.constructor.name);
        return model;
    }

    async create_view(model, options = {}) {
        console.log("StubWidgetManager trying to create view for model:", model);
        let ViewClass = DOMWidgetView; // Default to base view
        const viewModuleName = model.get('_view_module');
        const viewName = model.get('_view_name');
        console.log(`_view_module: ${viewModuleName}, _view_name: ${viewName}`);

        // Check if the model specifies a view from our application module
        if (viewModuleName === (window.IpypetrinetWebApp && window.IpypetrinetWebApp.version ? window.IpypetrinetWebApp.version.MODULE_NAME : 'ipypetrinet') && 
            viewName) { // Check if viewName is not null or undefined
            console.log(`Attempting to load ViewClass: ${viewName} from IpypetrinetWebApp`);
            if (window.IpypetrinetWebApp && window.IpypetrinetWebApp[viewName]) {
                ViewClass = window.IpypetrinetWebApp[viewName];
                console.log('Found ViewClass:', ViewClass.name);
            } else {
                console.warn(`View class ${viewName} not found in IpypetrinetWebApp. Falling back to DOMWidgetView.`);
            }
        } else {
            console.log('View module/name does not match IpypetrinetWebApp or viewName is missing. Using default DOMWidgetView.');
        }

        const view = new ViewClass({ model: model, ...options });
        console.log('Constructed view instance type:', view.constructor.name);
        return view;
    }

    async display_view(msg, view, options) { // msg is usually undefined for direct display
        const target_el = options.el || document.body; // Default to body or specified element
        target_el.appendChild(view.el);
        view.render(); // Ensure render is called
        view.trigger('displayed'); // Trigger displayed event
        return view;
    }

     async loadClass(className, moduleName, moduleVersion) {
        if (moduleName === '@jupyter-widgets/base') {
            if (className === 'LayoutModel') return LayoutModel;
            if (className === 'StyleModel') return StyleModel;
            if (className === 'DOMWidgetModel') return DOMWidgetModel;
            if (className === 'DOMWidgetView') return DOMWidgetView;
        }
        // Attempt to load the actual widget classes if they are globally available
        if (moduleName === (window.IpypetrinetWebApp && window.IpypetrinetWebApp.version ? window.IpypetrinetWebApp.version.MODULE_NAME : 'ipypetrinet')) {
            if (window.IpypetrinetWebApp && window.IpypetrinetWebApp[className]) {
                return window.IpypetrinetWebApp[className];
            }
        }
        console.error(`STUB StubWidgetManager: Cannot load class ${className} from ${moduleName}. Ensure it is exported by your main widget and available globally (e.g., window.IpypetrinetWebApp.${className}).`);
        // Fallback to a generic model/view if specific class not found, to prevent outright crash.
        if (className.endsWith('Model')) return DOMWidgetModel;
        if (className.endsWith('View')) return DOMWidgetView;
        return null;
    }
} 