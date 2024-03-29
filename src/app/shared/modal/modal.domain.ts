import {
  Injector,
  Type
} from '@angular/core';
import {
  Observable
} from 'rxjs/Observable';

export interface ModalOptions {
  index?: number;
  autoCloseTimeout?: number;
  closeByClickingOutside?: boolean;
  closeByEscapeKeyPressed?: boolean;
  backdropColor?: string;
  parentInjector: Injector;
}

export interface IModalHolderComponent {
  addDialog<TIn, TResult>(
    component: Type<IModalComponent<TIn, TResult>>,
    data?: TIn,
    options?: ModalOptions
  ): Observable<TResult>;

  removeDialog(component: IModalComponent<any, any>): void;
}

export interface IModalWrapperComponent {
  isVisible: boolean;
  loadComponent<TIn, TResult>(
    componentType: Type<IModalComponent<TIn, TResult>>
  ): IModalComponent<TIn, TResult>;
}

export interface IModalComponent<TIn, TOut> {
  /**
   * Dialog wrapper (modal placeholder)
   */
  wrapper: IModalWrapperComponent;

  closeHandler: (wrapper: IModalComponent<any, any>) => void;

  /**
   *
   * @param {Tin} data
   * @return {Observable<TOut>}
   */
  fillData(data: TIn): Observable<TOut>;
  close(): void;
}
