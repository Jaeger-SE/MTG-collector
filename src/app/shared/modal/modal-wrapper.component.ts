import {
  Component,
  ComponentFactoryResolver,
  Input,
  ReflectiveInjector,
  Type,
  ViewChild,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  IModalComponent,
  IModalWrapperComponent
} from './modal.domain';

@Component({
  template: `
          <div #container class="modal-content" [hidden]="!isVisible">
              <ng-template #element></ng-template>
          </div>
  `
})
export class ModalWrapperComponent implements IModalWrapperComponent, OnInit {
  @ViewChild('container')
  container: ViewContainerRef;
  @ViewChild('element', {
    read: ViewContainerRef
  })
  element: ViewContainerRef;
  isVisible: boolean;

  @Input()
  closeHandler: (wrapper: IModalComponent<any, any>) => void;

  private _isInit: boolean;

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit(): void { }

  loadComponent<TIn, TResult>(componentType: Type<IModalComponent<TIn, TResult>>): IModalComponent<TIn, TResult> {
    const factory = this.resolver.resolveComponentFactory(componentType);
    const injector = ReflectiveInjector.fromResolvedProviders(
      [],
      this.element.injector
    );
    const componentRef = factory.create(injector);
    this.element.insert(componentRef.hostView);
    const component = componentRef.instance;
    component.wrapper = this;
    return component;
  }
}
