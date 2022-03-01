import { LOTTO } from "../constants/constants.js";
export default class Lotto {
  #numbers = [];

  constructor(strategy) {
    this.pickStrategy = strategy;
  }

  get numbers() {
    return this.#numbers;
  }

  generate() {
    this.#numbers = this.pickStrategy.pickNumbers();
    return this;
  }
}
