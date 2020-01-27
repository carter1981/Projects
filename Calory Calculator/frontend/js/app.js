import '../styles/app.scss';
import Utils from './helpers/utils.js';

import Header from './views/sections/header.js';
import Footer from './views/sections/footer.js';

import About from './views/pages/about.js';
import Error404 from './views/pages/error404.js';
import Calculator from './views/pages/products/calculator.js';
import MyProducts from './views/pages/products/my-products.js';
import Info from './views/pages/products/info.js';

const Routes = {
  '/': About,
  '/calculator': Calculator,
  '/my-products': MyProducts,
  '/my-products/:id': Info
};

function router() {
  const headerSection = document.getElementsByTagName('HEADER')[0];
  const contentSection = document.getElementsByClassName('main-content')[0];
  const footerSection = document.getElementsByTagName('FOOTER')[0];

  const header = new Header();
  const footer = new Footer();

  header.render().then(content => (headerSection.innerHTML = content));
  footer.render().then(content => (footerSection.innerHTML = content));

  const request = Utils.parseRequestURL(),
    parsedURL = `/${request.resource || ''}${request.id ? '/:id' : ''}${
      request.action ? `/${request.action}` : ''
    }`,
    page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

  page.getData().then(data => {
    page.render(data).then(content => {
      contentSection.innerHTML = content;
      page.afterRender();
    });
  });
}

module.hot ? module.hot.accept(router()) : window.addEventListener('load', router);
window.addEventListener('hashchange', router);
