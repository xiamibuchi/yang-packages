/**
 * @See https://github.com/nuxt/nuxt/issues/15464
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response) => {
    if (!response.body || typeof response.body !== 'string') {
      return;
    }
    // Mark legacy chunks as nomodule (prevents modern browsers from loading them).
    // At the same time, unmark them as defer (otherwise System.register() in the legacy entry doesn't actually execute the code).
    response.body = response.body.replace(
      /(<script src="[^"]+-legacy\.[^>]+") defer/g,
      '$1 nomodule',
    );
    // Remove legacy chunks preload/prefetch (fixes warnings in modern browsers).
    response.body = response.body.replace(
      /<link rel="(preload|prefetch)" (as="script" )?(crossorigin )?href="[^"]+-legacy\..*?>/g,
      '',
    );
    response.body = response.body.replace(/\n+/g, '\n');
  });
});
