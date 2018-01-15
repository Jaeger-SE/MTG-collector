import { Injectable } from '@angular/core';

@Injectable()
export class TestService {
  id: number;
  constructor() {
    this.id = Math.round(Math.random() * 10000);
  }

}
