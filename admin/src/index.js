import PLUGIN_ID from './pluginId';
import AutoSaveComponent from "./components/AutoSave";

export default {
  register(app) {
    console.log('registering');
    app.registerPlugin({
      id: PLUGIN_ID,
      isReady: true,
      name: PLUGIN_ID,
      injectComponent: 'edit-view',
      Component: AutoSaveComponent,
    });
    console.log('registered');
  },
    bootstrap(app) {
      console.log('injecting component during bootstrap');
      app.injectContentManagerComponent('editView', 'right-links', {
        name: 'autosave-help',
        Component: AutoSaveComponent,
      });
    },
};
