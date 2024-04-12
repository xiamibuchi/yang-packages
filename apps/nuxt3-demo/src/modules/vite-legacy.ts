import { defineNuxtModule } from 'nuxt/kit';

// Fix vite-legacy build, see https://github.com/nuxt/nuxt/issues/15464
export default defineNuxtModule({
  setup(_option, nuxt) {
    nuxt.hook('build:manifest', (manifest) => {
      const polyfillKey = '../vite/legacy-polyfills-legacy'; // vite/legacy-polyfills、vite/legacy-polyfills-legacy
      const polyfillEntry = manifest[polyfillKey];
      if (!polyfillEntry) return;
      const oldManifest = { ...manifest };
      delete oldManifest[polyfillKey];
      // clear manifest.
      for (const key in manifest) {
        delete manifest[key];
      }
      manifest = {
        [polyfillKey]: polyfillEntry,
        ...oldManifest,
      };
      manifest[polyfillKey] = polyfillEntry;
      for (const key of Object.keys(manifest)) {
        if (key.match(/-legacy(\.|$)/)) {
          manifest[key].module = false;
        }
      }
    });
  },
});
