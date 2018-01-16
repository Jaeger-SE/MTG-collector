import {
  NgModule,
  ModuleWithProviders,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  ModalHolderComponent
} from './modal-holder.component';
import {
  ModalWrapperComponent
} from './modal-wrapper.component';
import {
  ModalService,
  ModalServiceConfig
} from './modal.service';

/**
 * Dialog service factory. Creates dialog service with options
 * @param { ComponentFactoryResolver } resolver
 * @param { ApplicationRef } applicationRef
 * @param { Injector } injector
 * @param { DialogServiceConfig } options
 * @return { DialogService }
 */
export function dialogServiceFactory(
  resolver: ComponentFactoryResolver,
  applicationRef: ApplicationRef,
  injector: Injector,
  options: ModalServiceConfig
) {
  return new ModalService(resolver, applicationRef, injector, options);
}

@NgModule({
  declarations: [ModalHolderComponent, ModalWrapperComponent],
  imports: [BrowserAnimationsModule, CommonModule],
  entryComponents: [ModalHolderComponent, ModalWrapperComponent]
})
export class ModalModule {
  static forRoot(config?: ModalServiceConfig): ModuleWithProviders {
    return {
      ngModule: ModalModule,
      providers: [{
        provide: ModalServiceConfig,
        useValue: config
      },
      {
        provide: ModalService,
        useFactory: dialogServiceFactory,
        deps: [
          ComponentFactoryResolver,
          ApplicationRef,
          Injector,
          ModalServiceConfig
        ]
      }
      ]
    };
  }
}
