
class Products {

  static setProductsToLS(products) {
    localStorage.setItem('Products', JSON.stringify(products));
  }

  getProductsFromDB() {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', 'http://localhost:4000/api/products', true);

      xhr.onload = () => {
        try {
          resolve(JSON.parse(xhr.response));
        } catch (error) {
          alert('There is an error occurred while loading data');
        }
      };

      xhr.send();

    });
  }


  getMyProductsSetFromDB() {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', 'http://localhost:4000/api/set', true);

      xhr.onload = () => {
        try {
          resolve(JSON.parse(xhr.response));
        } catch (error) {
          alert('There is an error occurred while loading data');
        }
      };

      xhr.send();
    });
  }

  addMySet(newSet) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'http://localhost:4000/api/set', true);
      xhr.setRequestHeader('Content-type', 'application/json');

      xhr.onload = () => {
        try {
          resolve(JSON.parse(xhr.response));
        } catch (error) {
          alert('There is an error occurred while loading data');
        }
      };

      xhr.send(JSON.stringify(newSet));
    });
  }

  removeMySet(id) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('DELETE', `http://localhost:4000/api/set/${id}`, true);

      xhr.onload = () => {
        try {
          resolve(JSON.parse(xhr.response));
        } catch (error) {
          alert('There is an error occurred while loading data');
        }
      };

      xhr.send();
    });
  }

  getMySet(id) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `http://localhost:4000/api/set/${id}`, true);

      xhr.onload = () => {
        try {
          resolve(JSON.parse(xhr.response));
        } catch (error) {
          alert('There is an error occurred while loading data');
        }
      };

      xhr.send();
    });
  }
}

export default Products;
