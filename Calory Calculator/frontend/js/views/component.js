import Utils from '../helpers/utils';

class Component {
  constructor() {
    this.request = Utils.parseRequestURL();
  }

  getData() {
    return new Promise(resolve => resolve());
  }

  afterRender() {}

  setCalculationsToLS() {
    const currentCalculations = [];
    localStorage.setItem('Current Calculations', JSON.stringify(currentCalculations));
  }

  setShoppingListToLS() {
    const shoppingList = [];
    localStorage.setItem('Shopping List', JSON.stringify(shoppingList));
  }

  getShoppingListFromLS() {
    return JSON.parse(localStorage.getItem('Shopping List'));
  }

  getCalculationsFromLS() {
    return JSON.parse(localStorage.getItem('Current Calculations'));
  }

}

export default Component;
