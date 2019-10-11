import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../validation-service';

@Component({
  selector: 'app-control-message',
  template: `<div *ngIf="errorMessage !== null"></div>`,
  styleUrls: ['./control-message.component.scss']
})
export class ControlMessageComponent implements OnInit {

  // errorMessage: string;

  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }

  ngOnInit() {
  }

}
