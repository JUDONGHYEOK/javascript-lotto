import { LOTTO } from "../constants/constants.js";
import Lotto from "../domains/Lotto.js";
import validateMoney from "../validations/LottoMachine.js";
import LottoStrategy from "./LottoStrategy.js";
export default class LottoMachine {
  #inputMoney = 0;
  #lottos = [];

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

  operateLottoMachine() {
    this.#lottos = this.generateLottos();
    this.#inputMoney = 0;
  }

  generateLottos() {
    return Array(this.lottoQuantity)
      .fill()
      .map(() => new Lotto(new LottoStrategy()).generate());
  }
}
