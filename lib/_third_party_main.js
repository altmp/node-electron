'use strict';

(async () => {
  const alt = process._linkedBinding('alt');
  const path = require('path');
  const asyncESM = require('internal/process/esm_loader');
  const { pathToFileURL } = require('internal/url');
  const decorateErrorStack = require('internal/util').decorateErrorStack;
  let _exports = null;

  try {
    const loader = await asyncESM.loaderPromise;

    loader.hook({
      resolve(specifier, parentURL, defaultResolve) {
        if (alt.hasResource(specifier)) {
          return {
            url: specifier,
            format: 'alt'
          };
        }
        
        return defaultResolve(specifier, parentURL);
      }
    });
    
    //const _path = path.resolve('resources', __resourceName, alt.getResourceMain(__resourceName));
    const _path = path.resolve(alt.getResourcePath(__resourceName), alt.getResourceMain(__resourceName));

    _exports = await loader.import(pathToFileURL(_path).pathname);
    if ('start' in _exports) {
      const start = _exports.start;
      if (typeof start === 'function') {
        await start();
      }
    }
  } catch (e) {
    console.error(e);
  }

  alt.resourceLoaded(__resourceName, _exports);
})();
