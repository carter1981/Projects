import Component from '../../component';

import MyProductsTemplate from '../../../../templates/pages/products/my-products';
import Products from '../../../models/products';


class MyProducts extends Component {
	constructor() {
		super();
		this.model = new Products();
	}

	getData() {
		return new Promise(resolve => this.model.getMyProductsSetFromDB().then(sets => resolve(sets)));
	}

	render(sets) {
		return new Promise(resolve => resolve(MyProductsTemplate({
			productsSet: sets
		})));
	}

	afterRender() {
		this.setActions();
	}

	setActions() {
		const productsArea = document.querySelector('.my-products__wrapper');

		productsArea.addEventListener('click', () => this.redirectToProductList());
		productsArea.addEventListener('click', () => this.removeFromMySets(productsArea));
	}

	redirectToProductList() {
    const target = event.target;
		if (target.classList.contains('set-item')) {
			location.hash = `#/my-products/${target.dataset.id}`;
		}
	}

	removeFromMySets(productsArea) {
		const target = event.target;

		if (target.classList.contains('remove-list')) {
			const id = target.parentElement.dataset.id;

			this.model.removeMySet(id);

			productsArea.removeChild(target.parentElement);
		}
	}
}

export default MyProducts;
