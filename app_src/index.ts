// Copyright (c) Jakob Bucksch
// Distributed under the terms of the Modified BSD License.

export * from './version';
export * from './widget';

// --- NEW INITIALIZATION CODE ---
import { MODULE_NAME, MODULE_VERSION } from './version'; // Ensure these are exported from version.ts
import { PetriModel, PetriView } from './widget';
import { StubWidgetManager } from '../stubs/jupyter-widgets-base';

declare global {
    interface Window { IpypetrinetWebApp: any; }
}

// Make a globally accessible reference to the app's exports
// This helps the StubWidgetManager to potentially find your actual Model/View classes.
window.IpypetrinetWebApp = {
    PetriModel: PetriModel,
    PetriView: PetriView,
    version: {
        MODULE_NAME: MODULE_NAME,
        MODULE_VERSION: MODULE_VERSION
    }
    // If customTransition is a class that needs to be found by name, export it from widget.ts
    // and add it here, e.g., customTransition: customTransition
};

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('petrinet-widget-container');
    if (container) {
        try {
            console.log('Attempting to initialize PetriView...');
            const manager = new StubWidgetManager();

            const model = await manager.new_widget({
                model_name: PetriModel.model_name,
                model_module: PetriModel.model_module,
                model_module_version: PetriModel.model_module_version,
                // These view_ attributes are often part of the model's definition in defaults()
                // view_name: PetriModel.view_name, 
                // view_module: PetriModel.view_module,
                // view_module_version: PetriModel.view_module_version,
                state: {
                    graph: [],       // Initial state based on PetriModel defaults
                    caseAttrs: []  // Initial state based on PetriModel defaults
                }
            });

            if (!model) {
                console.error('Failed to create PetriModel instance.');
                container.innerHTML = '<p>Error: Could not create Petri net model.</p>';
                return;
            }
            console.log('PetriModel created:', model);

            const view = await manager.create_view(model, {}); 

            if (!view) {
                console.error('Failed to create PetriView instance.');
                container.innerHTML = '<p>Error: Could not create Petri net view.</p>';
                return;
            }
            console.log('PetriView created:', view);
            
            container.innerHTML = ''; // Clear "Loading..." message

            await manager.display_view(undefined, view, { el: container });
            console.log('PetriView displayed in container.');

        } catch (error) {
            console.error('Error initializing PetriView:', error);
            if (container) {
                container.innerHTML = `<p>Error initializing widget. See console for details.</p><pre>${error.stack || error}</pre>`;
            }
        }
    } else {
        console.error('Petri net container (petrinet-widget-container) not found in HTML!');
    }
});