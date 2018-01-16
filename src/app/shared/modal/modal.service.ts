import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Optional,
  Type
} from '@angular/core';
import {
  Observable
} from 'rxjs/Observable';

import {
  IModalComponent,
  ModalOptions
} from './modal.domain';
import {
  ModalHolderComponent
} from './modal-holder.component';
import { inject } from '@angular/core/testing';

export class ModalServiceConfig {
  container: HTMLElement = null;
}

@Injectable()
export class ModalService {
  /**
   * Placeholder of modal dialogs
   * @type {DialogHolderComponent}
   */
  private _modalHolderComponent: ModalHolderComponent;

  /**
   * HTML container for dialogs
   * type {HTMLElement}
   */
  private _modalContainerHtmlElement: HTMLElement;

  /**
   * Constructor
   */
  constructor(
    private resolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    @Optional() config?: ModalServiceConfig
  ) {
    this._modalContainerHtmlElement = config && config.container;
  }

  /**
   * Adds dialog
   * @param {Type<DialogComponent<TData, TResult>>} component
   * @param {TData?} data
   * @param {DialogOptions?} options
   * @return {Observable<TResult>}
   */
  addDialog<TData, TResult>(
    component: Type<IModalComponent<TData, TResult>>,
    data?: TData,
    options?: ModalOptions
  ): Observable<TResult> {
    if (!this._modalHolderComponent) {
      let injector = options.parentInjector;
      if (!injector) {
        injector = this.injector;
      }
      this._modalHolderComponent = this.createDialogHolder(injector);
    }
    return this._modalHolderComponent.addDialog<TData, TResult>(
      component,
      data,
      options
    );
  }

  /**
   * Creates and add to DOM dialog holder component
   * @return {DialogHolderComponent}
   */
  private createDialogHolder(injector: Injector): ModalHolderComponent {
    const componentFactory = this.resolver.resolveComponentFactory(
      ModalHolderComponent
    );

    const componentRef = componentFactory.create(injector);
    const componentRootNode = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    if (!this._modalContainerHtmlElement) {
      const componentRootViewContainer = this.applicationRef.components[0];
      this._modalContainerHtmlElement = (componentRootViewContainer.hostView as EmbeddedViewRef<
        any>
      ).rootNodes[0] as HTMLElement;
    }
    this.applicationRef.attachView(componentRef.hostView);

    componentRef.onDestroy(() => {
      this.applicationRef.detachView(componentRef.hostView);
    });
    this._modalContainerHtmlElement.appendChild(componentRootNode);

    return componentRef.instance;
  }
}
