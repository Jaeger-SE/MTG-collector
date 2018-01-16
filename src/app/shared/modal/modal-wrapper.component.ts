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
          <div #container class="modal-content">
              <ng-template #element></ng-template>
          </div>
  `
})
export class ModalWrapperComponent implements IModalWrapperComponent, OnInit {
  @ViewChild('container') public container: ViewContainerRef;
  @ViewChild('element', {
    read: ViewContainerRef
  })
  public element: ViewContainerRef;

  @Input() public closeHandler: (wrapper: IModalComponent<any, any>) => void;

  private _isInit: boolean;

  private _isVisible: boolean;
  public get isVisible(): boolean {
    return this._isVisible;
  }
  public set isVisible(isVisible: boolean) {
    this._isVisible = isVisible;
  }

  private _isCollapsed: boolean;
  public get isCollapsed(): boolean {
    return this._isCollapsed;
  }
  public set isCollapsed(isCollapsed: boolean) {
    this._isCollapsed = isCollapsed;
  }

  public get stateName(): string {
    return this._isVisible ? 'show' : 'hide';
  }

  constructor(private resolver: ComponentFactoryResolver) {
    this._isCollapsed = false;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this._isVisible = true;
      this._isInit = true;
    }, 30);
  }

  loadComponent<TIn, TResult>(
    componentType: Type<IModalComponent<TIn, TResult>>
  ): IModalComponent<TIn, TResult> {
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
