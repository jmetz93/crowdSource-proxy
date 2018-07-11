const express = require('express');
const morgan = require('morgan');
const parser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3900;

app.use(cors())
app.use(morgan('dev'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.json');
const loader = require('./loader.js');
const services = loader(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout.js');
const App = require('./templates/app.js');
const Scripts = require('./templates/scripts.js');

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  });
};

app.get('/', function(req, res) {
  let components = renderComponents(services);
  // let props = {id: req.params.id};
  res.end(Layout(
    'SDC SSR Proxy',
    App(...components),
    Scripts(Object.keys(services))
  ));
});


app.listen(port, () => {
  console.log('listening on port ', port);
})