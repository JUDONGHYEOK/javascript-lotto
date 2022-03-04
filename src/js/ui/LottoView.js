import LottoMachine from '../domains/LottoMachine.js';
import $ from './utils.js';
import {
  ticketImg,
  lottoNumberTemplate,
  purchaseMessageTemplate
} from './template.js';
import { DOM } from '../constants/constants.js';

export default class LottoView {
  constructor() {
    this.machine = new LottoMachine();
    this.$lottoResultContainer = $(DOM.ID.LOTTO_RESULT_CONTAINER);
    this.bindEvents();
  }

  bindEvents() {
    $(DOM.ID.PURCHASE_MONEY_FORM).addEventListener(
      'submit',
      this.handlePurchaseForm.bind(this)
    );
    $(DOM.ID.LOTTO_RESULT_TOGGLE).addEventListener(
      'click',
      this.handleResultToggle.bind(this)
    );
  }

  handlePurchaseForm(event) {
    event.preventDefault();
    try {
      this.insertMoney();
      this.machine.operateLottoMachine();
      this.renderLottoAmount();
      this.renderLotto();
      this.disablePurchase();
      this.showLottoContainers();
      this.focusWinningNumberForm();
      this.bindEventsToResultForm();
    } catch (e) {
      alert(e.message);
    }
  }

  handleResultToggle() {
    this.renderLotto();
  }

  insertMoney() {
    this.machine.inputMoney = Number($(DOM.ID.PURCHASE_MONEY_INPUT).value);
  }

  renderLotto() {
    this.$lottoResultContainer.replaceChildren();
    $(DOM.ID.TOGGLE_CHECKBOX).checked
      ? this.renderLottoNumbers()
      : this.renderLottoImgs();
  }

  renderLottoImgs() {
    this.machine.lottos.map(() => {
      this.$lottoResultContainer.insertAdjacentHTML('beforeEnd', ticketImg);
    });
  }

  renderLottoNumbers() {
    this.machine.lottos.map((lotto) => {
      this.$lottoResultContainer.insertAdjacentHTML(
        'beforeEnd',
        lottoNumberTemplate(lotto.numbers.join(', '))
      );
    });
  }

  renderLottoAmount() {
    $(DOM.ID.LOTTO_RESULT_SPAN).textContent = purchaseMessageTemplate(
      this.machine.lottos
    );
  }

  disablePurchase() {
    $(DOM.ID.PURCHASE_MONEY_INPUT).disabled = true;
    $(DOM.ID.PURCHASE_MONEY_BUTTON).disabled = true;
  }

  showLottoContainers() {
    $(DOM.ID.LOTTO_RESULT_SECTION).hidden = false;
    $(DOM.ID.WINNING_NUMBER_FORM).hidden = false;
  }

  hideLottoContainers() {
    $(DOM.ID.LOTTO_RESULT_SECTION).hidden = true;
    $(DOM.ID.WINNING_NUMBER_FORM).hidden = true;
  }

  focusWinningNumberForm() {
    document.querySelector('.winning-number-input').focus();
  }

  bindEventsToResultForm() {
    $('winning-number-form').addEventListener(
      'submit',
      this.handleResultForm.bind(this)
    );
  }

  handleResultForm(e) {
    e.preventDefault();
    const winningNumbers = Array.from(
      document.querySelectorAll('.winning-number-input')
    ).map(({ value }) => Number.parseInt(value));
    const bonusNumber = winningNumbers.pop();
    this.machine.calculateGrade(winningNumbers, bonusNumber);
    $('lotto-result-table').replaceChildren();
    $('lotto-result-table').insertAdjacentHTML(
      'beforeend',
      `  <div class="grid table-title"><span>일치 갯수</span><span>당첨금</span><span>당첨 갯수</span></div>
    <div class="grid"><span>3개</span><span>5,000</span><span>${this.machine.getNumberOfGrade(
      'fifth'
    )}개</span></div>
    <div class="grid"><span>4개</span><span>50,000</span><span>${this.machine.getNumberOfGrade(
      'fourth'
    )}개</span></div>
    <div class="grid"><span>5개</span><span>1,500,000</span><span>${this.machine.getNumberOfGrade(
      'third'
    )}개</span></div>
    <div class="grid"><span>5개+보너스볼</span><span>30,000,000</span><span>${this.machine.getNumberOfGrade(
      'second'
    )}개</span></div>
    <div class="grid"><span>6개</span><span>2,000,000,000</span><span>${this.machine.getNumberOfGrade(
      'first'
    )}개</span></div>
 `
    );
    $('modal').style.display = 'flex';
    $('modal-close').addEventListener('click', this.closeModal.bind(this));
    $('restart').addEventListener('click', this.restart.bind(this));
  }
  closeModal() {
    $('modal').style.display = 'none';
  }
}
