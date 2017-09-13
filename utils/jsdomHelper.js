
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
// import JSDOM from 'jsdom';
var exposedProperties = ['window', 'navigator', 'document'],
    dom=new JSDOM();

global.document = dom.window.document;
console.log("Object.keys(document): ",Object.keys(dom.window.document));
global.window = dom.window.document.defaultView;
Object.keys(dom.window.document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = dom.window.document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

// documentRef = dom.window.document;
