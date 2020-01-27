import Component from '../../../views/component';
import Products from '../../../models/products';

import InfoTemplate from '../../../../templates/pages/products/info/info';
import Error404Template from '../../../../templates/pages/error404';

class Info extends Component {
  constructor() {
    super();

    this.model = new Products();
  }

  getData() {
    return new Promise(resolve => this.model.getMySet(this.request.id).then(set => resolve(set)));
  }

  render(set) {
    return new Promise(resolve => {
      let content;

      if (Object.keys(set).length) {

        content = InfoTemplate({
          name: set.name,
          products: set.products
        });
      } else {
        content = Error404Template();
      }

      resolve(content);
    });
  }

  afterRender() {
    const backButton = document.getElementsByClassName('back')[0];

    backButton.addEventListener('click', () => location.hash = '#/my-products');
  }
}

export default Info;
