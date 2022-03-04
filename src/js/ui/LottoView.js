import LottoMachine from '../domains/LottoMachine.js';
import $ from './utils.js';
import {
  ticketImg,
  lottoNumberTemplate,
  purchaseMessageTemplate
} from './template.js';
import { DOM } from '../constants/constants.js';
import { validateArrayNumber } from '../validations/utils.js';
import { LottoModal } from './LottoModal.js';

export default class LottoView {
  constructor() {
    this.machine = new LottoMachine();
    this.$lottoResultContainer = $(DOM.ID.LOTTO_RESULT_CONTAINER);
    this.bindEvents();
    this.lottoModal = new LottoModal(this, this.machine);
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
    try {
      validateArrayNumber(winningNumbers);
      const bonusNumber = winningNumbers.pop();
      machine.calculateGrade(winningNumbers, bonusNumber);
      this.lottoModal.show(this.machine);
    } catch (e) {
      alert(e.message);
    }
  }

  restart() {
    this.hideLottoContainers();
    this.reactivatePurchaseForm();
    this.machine = new LottoMachine();
  }

  reactivatePurchaseForm() {
    document
      .querySelectorAll('.winning-number-input')
      .forEach((element) => (element.value = ''));
    $('purchase-money-input').value = '';
    $('purchase-money-input').disabled = false;
    $('purchase-money-button').disabled = false;
    $(DOM.ID.TOGGLE_CHECKBOX).checked = false;
  }
}
