import {
  Component,
  OnInit
} from '@angular/core';
import { TestService } from '../../services/test.service';
import { ModalBaseComponent } from '../../../../shared/modal/modal-base.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends ModalBaseComponent<undefined, undefined> implements OnInit {

  random: number;

  constructor(public testService: TestService) {
    super();
    this.random = Math.random() * 1000;
  }

  ngOnInit() { }

}
