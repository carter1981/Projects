import Component from '../../views/component';

import HeaderTemplate from '../../../templates/sections/header';

class Header extends Component {
  render() {
    const resource = this.request.resource;

    return new Promise(resolve => resolve(HeaderTemplate({
      isAboutPage: !resource,
      isCalculatorPage: (resource === 'calculator'),
      isMyProductsPage: (resource === 'my-products')
    })));
   }
}

export default Header;
