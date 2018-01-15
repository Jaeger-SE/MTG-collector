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

  constructor(public testService: TestService) {
    super();
  }

  ngOnInit() { }

}
