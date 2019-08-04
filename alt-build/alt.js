'use strict';

const alt = process.binding('alt');

alt.loadResource = async function(resourceName) {
  const asyncESM = require('internal/process/esm_loader');
  const getURLFromFilePath = require('internal/url').getURLFromFilePath;
  const decorateErrorStack = require('internal/util').decorateErrorStack;

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
    
    const _exports = await loader.import(getURLFromFilePath(process.argv[1]).pathname);
    alt.resourceLoaded(resourceName, _exports);
  } catch (e) {
    decorateErrorStack(e);
    console.error(e);
    process.exit(1);
  }
};

module.exports = alt;
