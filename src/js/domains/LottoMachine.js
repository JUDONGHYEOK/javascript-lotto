import { LOTTO } from '../constants/constants.js';
import Lotto from '../domains/Lotto.js';
import validateMoney from '../validations/LottoMachine.js';
import LottoStrategy from './LottoStrategy.js';
export default class LottoMachine {
  #inputMoney;
  #lottos;
  #strategy;

  constructor() {
    this.#inputMoney = 0;
    this.#lottos = [];
    this.#strategy = new LottoStrategy();
  }

  get inputMoney() {
    return this.#inputMoney;
  }

  set inputMoney(money) {
    validateMoney(money);
    this.#inputMoney = money;
  }

  get lottos() {
    return this.#lottos;
  }

  get lottoQuantity() {
    return this.#inputMoney / LOTTO.PRICE;
  }

  updateStrategy(strategy) {
    this.#strategy = strategy;
  }

  operateLottoMachine() {
    this.#lottos = this.generateLottos();
    this.#inputMoney = 0;
  }

  generateLottos() {
    return Array(this.lottoQuantity)
      .fill()
      .map(() => new Lotto(this.#strategy).generate());
  }

  calculateGrade(winningNumbers, bonusNumber) {
    this.#lottos.forEach((lotto) =>
      lotto.generateGrade(winningNumbers, bonusNumber)
    );
  }
}
