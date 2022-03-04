import LottoMachine from '../domains/LottoMachine';
import { validateArrayNumber } from '../validations/utils';
import { lottoResultTableTemplate } from './template';
import $ from './utils';

export class LottoModal {
  constructor(view) {
    this.lottoView = view;
  }

  show(machine) {
    $('lotto-result-table').replaceChildren();
    $('lotto-result-table').insertAdjacentHTML(
      'beforeend',
      lottoResultTableTemplate(machine)
    );
    $(
      'lotto-result-rate'
    ).textContent = `당신의 총 수익률은 ${machine.profitRate}%입니다.`;
    $('modal').style.display = 'flex';
    this.bindEventsToModalBtn();
  }

  bindEventsToModalBtn() {
    $('modal-close').addEventListener('click', this.closeModal.bind(this));
    $('restart').addEventListener('click', this.restart.bind(this));
  }
  restart() {
    this.closeModal();
    this.lottoView.restart();
  }
  closeModal() {
    $('modal').style.display = 'none';
  }
}
