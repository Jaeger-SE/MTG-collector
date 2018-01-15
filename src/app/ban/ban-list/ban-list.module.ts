import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  ModalModule
} from '../../shared/modal/modal.module';

import {
  SearchComponent
} from './components/search/search.component';
import {
  IndexComponent
} from './components/index/index.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule
  ],
  declarations: [IndexComponent, SearchComponent],
  entryComponents: [SearchComponent],
  exports: [IndexComponent]
})
export class BanListModule { }
