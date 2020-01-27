import Component from '../../component';
import Products from '../../../models/products';

import CalculatorTemplate from '../../../../templates/pages/products/calculator/calculator';
import CalculatorInputTemplate from '../../../../templates/pages/products/calculator/calculatorInput';
import NamingInputTemplate from '../../../../templates/pages/products/calculator/namingInput';
import CalculatorCaloryItemTemplate from '../../../../templates/pages/products/calculator/calculatorCaloryItem';
import CalculatorGramItemTemplate from '../../../../templates/pages/products/calculator/calculatorGramItem';
import CalculatorClearCartTemplate from '../../../../templates/pages/products/calculator/calculatorClearCart';

class Calculator extends Component {
	constructor() {
		super();

		this.model = new Products();
	}

	getData() {
		return new Promise(resolve => this.model.getProductsFromDB().then(products => resolve(products)));
	}

	render(products) {

		return new Promise(resolve => resolve(CalculatorTemplate({
			milkProducts: this.filterProducts('Milk', products),
			bakeryProducts: this.filterProducts('Bakery', products),
			groceryProducts: this.filterProducts('Grocery', products),
			fruits: this.filterProducts('Fruits', products),
			vegetables: this.filterProducts('Vegetables', products),
			sideDishes: this.filterProducts('Side-dishes', products),
			meatProducts: this.filterProducts('Meat', products),
			fishProducts: this.filterProducts('Fish', products)
		})));
	}

	filterProducts(productCategory, products) {
		return products.filter(product => product.category === productCategory);
	}

	afterRender() {
		this.setTabsAnimation();
		this.setActions();
		this.createLocalStorageItems();
	}

	setTabsAnimation() {
		const tabsNav = document.querySelectorAll('.tab-nav'),
			tabsContent = document.querySelectorAll('.tab-content'),
			tabsContainer = document.getElementsByClassName('tabs-wrapper__inner')[0];

		tabsContainer.addEventListener('click', event => this.chooseTab(tabsNav, tabsContent));
	}

	chooseTab(tabsNav, tabsContent) {
		event.stopImmediatePropagation();
		const target = event.target;

		if (target.classList.contains('tab-nav')) {
			tabsNav.forEach(tab => tab.classList.remove('active-tab'));

			this.selectTabContent(target, tabsContent);

			target.classList.add('active-tab');
		}
	}

	selectTabContent(target, tabsContent) {
		tabsContent.forEach(content => {
			if (content.classList.contains(target.dataset.tabName)) {
				content.classList.remove('hide');
				content.classList.add('show');
			} else {
				content.classList.remove('show');
				content.classList.add('hide');
			}
		});
	}

	createLocalStorageItems() {
		window.onload = this.setCalculationsToLS();
		window.onload = this.setShoppingListToLS();
	}

	setActions() {
		const products = document.querySelectorAll('.product'),
			cart = document.querySelector('.cart'),
			result = document.querySelector('.result'),
			inputArea = document.getElementsByClassName('input-area')[0],
			nameInputArea = document.getElementById('naming-input-area'),
			shopListArea = document.querySelector('.shopping-list__items'),
			shoppingList = document.getElementsByClassName('shop-list-item'),
			tabShoppingList = document.getElementById('shoppingList'),
			calcListArea = document.getElementsByClassName('items-content')[0],
			calcButton = document.querySelector('.add'),
			saveMyProductsButton = document.querySelector('.save'),
			resetButton = document.querySelector('.clear');

		let total = 0;

		products.forEach(product => {
			product.addEventListener('dragstart', () => this.dragStart(cart, inputArea));
			product.addEventListener('dragend', () => this.dragEnd(cart));
		});

		tabShoppingList.addEventListener('click', () => this.saveShoppingItemsToLS(shopListArea, saveMyProductsButton, nameInputArea));

		cart.addEventListener('dragover', () => this.dragOver(cart));
		cart.addEventListener('dragleave', () => this.dragExit(cart));
		cart.addEventListener('drop', () => this.dragDrop(cart, inputArea, calcButton, resetButton));

		calcListArea.addEventListener('click', () => this.removeItemFromCalcArea(calcListArea, total, result));
		calcListArea.addEventListener('click', () => this.addToShoppingList(shopListArea));
		shopListArea.addEventListener('click', () => this.removeItemFromList(shopListArea, saveMyProductsButton, shoppingList, nameInputArea));

		calcButton.addEventListener('click', () => this.calculateButtonActions(calcButton, calcListArea, total, result, cart, resetButton));
		resetButton.addEventListener('click', () => this.resetAllCalculations(calcListArea, result, resetButton));
    saveMyProductsButton.addEventListener('click', () => this.saveMyProductsBtnActions(shopListArea, saveMyProductsButton));
	}

	dragStart(cart, inputArea) {
		cart.innerHTML = '';
		cart.classList.add('cart');
		cart.innerHTML += '<div class="cart-inner">Drop in here</div>';
		inputArea.innerHTML = '';
		event.dataTransfer.setData('key', event.target.id);
	}

	dragEnd(cart) {
		cart.classList.remove('cart-hovered');
	}

	dragOver(cart) {
		event.preventDefault();
		cart.classList.add('cart-hovered');
	}

	dragExit(cart) {
		cart.classList.remove('cart-hovered');
	}

	dragDrop(cart, inputArea, calcButton) {
		event.preventDefault();

		const data = event.dataTransfer.getData('key'),
			clonedItem = document.getElementById(data).cloneNode(true);

		clonedItem.id += Math.random()
			.toString(36)
			.substr(2, 3);

		cart.innerHTML = '';
		cart.classList.remove('cart');
		cart.classList.remove('cart-hovered');
		cart.appendChild(clonedItem);
		clonedItem.className = 'product-cloned';
		clonedItem.removeAttribute('draggable');

		this.saveClonedItemToLS(clonedItem);
		this.createInput(inputArea).then(this.setInputActions(calcButton));

	}

	saveClonedItemToLS(clonedItem) {
		clonedItem = {
			id: clonedItem.id,
			name: clonedItem.dataset.name,
			calory: clonedItem.dataset.calory,
			amount: 0,
			subtotal: 0
		};
		localStorage.setItem('Cloned Item', JSON.stringify(clonedItem));
	}

	createInput(inputArea) {
		return new Promise(resolve => {
			inputArea.innerHTML = CalculatorInputTemplate();
			resolve();
		});
	}

	setInputActions(calcButton) {
		const input = document.getElementById('calory-input'),
      inputGroup = document.getElementsByClassName('input-group')[0];

		inputGroup.addEventListener('keyup',() => this.validateInput(calcButton));
		input.addEventListener('change', () => this.getInputValue());
	}

	validateInput(calcButton) {
		const target = event.target,
      regexp = /[1-9]{1,}/i;

		if (target.tagName == 'INPUT' && target.value.match(regexp)) {
			calcButton.disabled = false;
		} else {
			target.value = '';
			calcButton.disabled = true;
		}
	}

	getInputValue() {
		let target = event.target;
		let inputValue = target.value;

		const clonedItemData = JSON.parse(localStorage.getItem('Cloned Item'));
		clonedItemData.amount = inputValue;
		localStorage['Cloned Item'] = JSON.stringify(clonedItemData);
	}

	calculateButtonActions(calcButton, calcListArea, total, result, cart, resetButton) {
		const productData = JSON.parse(localStorage.getItem('Cloned Item'));

		this.addSubtotalToClonedItem(productData);
		this.renderCaloryItem(productData, calcListArea);
		this.updateCalculationsInLS(productData);
		this.calculateCalory(total, result);
		this.clearInputValue(calcButton);
		this.clearCart(cart);

		resetButton.disabled = false;
	}

	addSubtotalToClonedItem(productData) {
		let caloryAmount = +productData.amount;
		let caloryValue = +productData.calory;
		let subtotal = Math.ceil(+((caloryAmount * caloryValue) / 100));
		productData.subtotal = subtotal;
		localStorage['Cloned Item'] = JSON.stringify(productData);
	}

	renderCaloryItem(productData, calcListArea) {
		return new Promise(resolve => {
			calcListArea.innerHTML += CalculatorCaloryItemTemplate({
				id: productData.id,
				name: productData.name,
				amount: productData.amount,
				calory: productData.calory,
				subtotal: productData.subtotal
			});

			resolve();
		});
	}

	updateCalculationsInLS(productData) {
		const calculationsData = this.getCalculationsFromLS();
		calculationsData.push(productData);
		localStorage['Current Calculations'] = JSON.stringify(calculationsData);
	}

	calculateCalory(total, result) {
		const listedItems = document.getElementsByClassName('list-item');

		total = Array.from(listedItems).reduce((sum, current) => {
			return sum + parseInt(current.dataset.subtotal);
		}, 0);

		this.renderCalculationResult(total, result);
	}

	renderCalculationResult(total, result) {
		result.innerHTML = '';
		result.innerHTML = total;
	}

	clearInputValue(calcButton) {
		const input = document.getElementById('calory-input');

		input.value = '';
		input.blur();
		calcButton.disabled = 'true';
	}

	clearCart(cart) {
		cart.innerHTML = CalculatorClearCartTemplate();
	}

	removeItemFromCalcArea(calcListArea, total, result) {
		const target = event.target;

		if (target.classList.contains('remove')) {
			const itemRow = target.parentElement.parentElement;
			calcListArea.removeChild(itemRow);
		}
		this.calculateCalory(total, result);
	}

	addToShoppingList(shopListArea) {
		const target = event.target;
		const itemToAdd = target.parentElement.parentElement;

		if (target.classList.contains('add-shop')) {
			return new Promise(resolve => {
				shopListArea.innerHTML += CalculatorGramItemTemplate({
					id: itemToAdd.dataset.id,
					name: itemToAdd.dataset.name,
					amount: itemToAdd.dataset.amount
				});

				resolve();
			});
		}
	}

	resetAllCalculations(calcListArea, result, resetButton) {
		const clonedItem = [];

		this.setCalculationsToLS();

		localStorage['Cloned Item'] = JSON.stringify(clonedItem);

		result.innerHTML = '0';
		calcListArea.innerHTML = '';
		resetButton.disabled = true;
	}

	saveShoppingItemsToLS(shopListArea, saveMyProductsButton, nameInputArea) {
		const shoppingListData = this.getShoppingListFromLS(),
      shoppingList = document.getElementsByClassName('shop-list-item');

		Array.from(shoppingList).forEach(item => {
			const shoppingListItem = {
				id: item.dataset.id,
				name: item.dataset.name,
				amount: item.dataset.amount
			};

			shoppingListData.push(shoppingListItem);
			localStorage['Shopping List'] = JSON.stringify(shoppingListData);
		});

		this.activateSaveButton(saveMyProductsButton, shoppingList, nameInputArea);
	}

	removeItemFromList(shopListArea, saveMyProductsButton, shoppingList, nameInputArea) {
		const target = event.target;

		if (target.classList.contains('remove')) {
			this.findItemInShoppingListLS(target);

			shopListArea.removeChild(target.parentElement);

			this.activateSaveButton(saveMyProductsButton, shoppingList, nameInputArea);
		}
	}

	findItemInShoppingListLS(target) {
		const shoppingListData = this.getShoppingListFromLS();

		const indexOfItemToRemove = shoppingListData.findIndex(item => {
			return item.id == target.parentElement.dataset.id;
		});

		shoppingListData.splice(indexOfItemToRemove, 1);
		localStorage['Shopping List'] = JSON.stringify(shoppingListData);
	}

	saveMyProductsBtnActions(shopListArea, saveMyProductsButton) {
		this.renderNameInput();
		this.afterRenderInputActions(shopListArea, saveMyProductsButton);
	}

	renderNameInput() {
		const nameInputArea = document.getElementsByClassName('input-area')[1];

		return new Promise(resolve => {
			nameInputArea.innerHTML = NamingInputTemplate();
			resolve();
		});
	}

	afterRenderInputActions() {
		const nameInput = document.getElementById('name-input'),
			doneButton = document.getElementById('done-button'),
			nameInputArea = document.getElementById('naming-input-area'),
			shoppingListArea = document.querySelector('.shopping-list__items'),
			shoppingListData = this.getShoppingListFromLS();

		nameInput.addEventListener('change', () => nameInput.value.trim());
		doneButton.addEventListener('click', () => this.doneButtonActions(nameInput, shoppingListData, nameInputArea, shoppingListArea));
	}

	doneButtonActions(nameInput, shoppingListData, nameInputArea, shoppingListArea) {
		this.createMySet(nameInput, shoppingListData);
		this.clearShopListAndInputArea(nameInputArea, shoppingListArea);
	}

	createMySet(nameInput, shoppingListData) {
		const singleSet = {
			name: nameInput.value.trim(),
			products: shoppingListData
		};

		this.model.addMySet(singleSet);
	}

	clearShopListAndInputArea(nameInputArea, shoppingListArea) {
		nameInputArea.innerHTML = '';
		this.setShoppingListToLS();
		shoppingListArea.innerHTML = '';
	}

	activateSaveButton(saveMyProductsButton, shoppingList, nameInputArea) {
		if (shoppingList.length === 0) {
			saveMyProductsButton.disabled = true;
			nameInputArea.innerHTML = '';
		} else {
			saveMyProductsButton.disabled = false;
		}
	}
}
export default Calculator;
