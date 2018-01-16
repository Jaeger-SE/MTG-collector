import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Injector,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import * as _ from 'lodash';
import {
  Observable
} from 'rxjs/Observable';

import {
  ModalOptions,
  IModalComponent,
  IModalHolderComponent,
  IModalWrapperComponent
} from './modal.domain';
import {
  ModalWrapperComponent
} from './modal-wrapper.component';

const fadeInDuration = 300;
const fadeOutDuration = 300;

interface ModalRegistration extends ModalOptions {
  component: IModalComponent<any, any>;
}

@Component({
  template: `
            <div #container class="modal" role="dialog">
              <div class="modal-background"></div>
              <ng-template #element></ng-template>
              <button class="modal-close is-large" (click)="closeDialog()"></button>
            </div>
            `,
  styleUrls: ['./modal.scss']
})
export class ModalHolderComponent implements IModalHolderComponent, OnInit {
  @ViewChild('container')
  container: ElementRef;
  @ViewChild('element', {
    read: ViewContainerRef
  })
  element: ViewContainerRef;

  private _modalComponents: IModalComponent<any, any>[];
  private _registeredComponentsStack: ModalRegistration[];

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector) {
    this._modalComponents = [];
    this._registeredComponentsStack = [];
  }

  private getOptionsExtended(options: ModalOptions): ModalRegistration {
    return Object.assign(<ModalRegistration>{}, options || <ModalOptions>{});
  }

  ngOnInit(): void {
  }

  addDialog<TIn, TResult>(
    component: Type<IModalComponent<TIn, TResult>>,
    data?: TIn,
    options?: ModalOptions
  ): Observable<TResult> {
    const optionExtended = this.getOptionsExtended(options);
    const factory = this.resolver.resolveComponentFactory(
      ModalWrapperComponent
    );
    const componentRef = this.element.createComponent(factory);
    const modalWrapper: ModalWrapperComponent = componentRef.instance;
    const _component: IModalComponent<any, any> = modalWrapper.loadComponent<TIn, TResult>(component);

    if (typeof optionExtended.index !== 'undefined') {
      this._modalComponents.splice(optionExtended.index, 0, _component);
    } else {
      this._modalComponents.push(_component);
    }
    optionExtended.component = _component;
    this.checkVisibility(_component);
    setTimeout(() => {
      this.container.nativeElement.classList.add('is-active');
      this.container.nativeElement.classList.add('in');
    });
    if (optionExtended.autoCloseTimeout) {
      setTimeout(() => {
        this.removeDialog(_component);
      }, optionExtended.autoCloseTimeout);
    }
    if (optionExtended.closeByClickingOutside) {
      this.closeByClickOutside();
    }
    if (optionExtended.closeByEscapeKeyPressed) {
      this._registeredComponentsStack.push(optionExtended);
    }
    if (optionExtended.backdropColor) {
      this.container.nativeElement.style.backgroundColor =
        optionExtended.backdropColor;
    }
    _component.closeHandler = this.removeDialog.bind(this);

    return _component.fillData(data);
  }

  private checkVisibility(activeModal: IModalComponent<any, any>) {
    _(this._modalComponents).forEach(x => {
      x.wrapper.isVisible = x === activeModal;
    });
  }

  closeDialog() {
    this.removeDialog(_(this._modalComponents).last());
  }

  removeDialog(component: IModalComponent<any, any>) {
    const shouldHideHolder = this._modalComponents.length <= 1;
    const nextComponent = _(this._modalComponents)
      .filter(x => x !== component)
      .last<IModalComponent<any,
      any>>();

    setTimeout(() => {
      if (shouldHideHolder) {
        const element = this.container.nativeElement;
        element.classList.remove('is-active');
        element.classList.remove('in');
      }
      this._removeElement(component);
    }, fadeOutDuration);
  }

  private _removeElement(component) {
    const index = this._modalComponents.indexOf(component);
    if (index >= 0) {
      this.element.remove(index);
      this._modalComponents.splice(index, 1);
      this.checkVisibility(_(this._modalComponents).last());
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    if (e.keyCode !== 27) {
      return;
    }
    if (this._modalComponents.length <= 0) {
      return;
    }
    const modalComp = this._modalComponents[this._modalComponents.length - 1];
    this.removeDialog(modalComp);
  }

  /**
   * Registers event handler to close dialog by click on backdrop
   */
  private closeByClickOutside() {
    const containerEl = this.container.nativeElement;
    containerEl
      .querySelector('.modal-background')
      .addEventListener('click', event => {
        if (this._modalComponents.length <= 0) {
          return;
        }
        this.removeDialog(
          this._modalComponents[this._modalComponents.length - 1]
        );
        event.stopPropagation();
      });
  }
}
