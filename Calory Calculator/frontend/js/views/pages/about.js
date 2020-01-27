import Component from '../../views/component';
import AboutTemplate from '../../../templates/pages/about';

class About extends Component {

  render() {
    return new Promise(resolve => resolve(AboutTemplate()));
  }



  afterRender() {
    this.setActions();
  }

  setActions() {
    const startUsingButton = document.querySelector('.start-using'),
      mainTitle = document.querySelector('.main-title');

    startUsingButton.addEventListener('click',() => this.redirectToCalculator());

    this.animateTitle(mainTitle);
  }

  redirectToCalculator() {
    location.hash = '#/calculator';
  }

  animateTitle(mainTitle) {
    const splitText = mainTitle.textContent.split('');
    let char = 0;

    mainTitle.textContent = '';

    splitText.forEach(letter => (mainTitle.innerHTML += `<span class="letter">${letter}</span>`)
    );

    let lettersTimer = setInterval(() => {
      const span = document.querySelectorAll('.letter')[char];
      span.classList.add('fade');
      char++;

      if (char === splitText.length) {
        clearInterval(lettersTimer);
      }
    }, 100);
  }
}

export default About;
