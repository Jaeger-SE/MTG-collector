import {
  Component,
  OnInit,
  Injector
} from '@angular/core';
import {
  TestService
} from '../../services/test.service';
import {
  ModalService
} from '../../../../shared/modal/modal.service';
import {
  SearchComponent
} from '../search/search.component';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [TestService]
})
export class IndexComponent implements OnInit {
  constructor(public testService: TestService, private modalService: ModalService, private injector: Injector) { }

  ngOnInit() { }

  openModal() {
    this.modalService.addDialog(SearchComponent, undefined, {
      parentInjector: this.injector
    });
  }
}
