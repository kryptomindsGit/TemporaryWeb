import { Directive } from '@angular/core';
import { AbstractControl, ValidatorFn, FormGroup, FormControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appGlobalValidation]'
})
export class GlobalValidationDirective {

  constructor() { }

  /**
   * @name emailValidator
   * @description Email Validation
   */

  static emailValidator(control: AbstractControl): { [key: string]: Boolean } | null {

    let regularExp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    // let regularExp = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    if (control.value !== undefined && !regularExp.test(control.value)) {
      return { "isValidEmail": true };
    }
    return null;
  }

  /**
   * @name emailValidator
   * @description Email Validation
   */
  // createEmailAlreadyTakenValidator(signupService: SignupService) {
  //   return (control: AbstractControl) => {
  //     return signupService.checkEmailNotTaken(control.value).map(res => {
  //       return res ? null : { emailTaken: true };
  //     });
  //   };
  // }



  /**
  * @name userNameValidator
  * @description User Name Validation (unique name)
  */

  static userNameValidator(c: FormControl): ValidationErrors {
    const message = {
      'uniqueName': {
        'message': 'The name is not unique'
      }
    };

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(c.value === 'Existing' ? message : null);
      }, 500);
    });
  }

  /**
  * @name numberValidator
  * @description Number Validation
  */

  static numberValidator(number): any {
    if (number.pristine) {
      return null;
    }
    const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;
    number.markAsTouched();
    if (NUMBER_REGEXP.test(number.value)) {
      return null;
    }
    return {
      invalidNumber: true
    };
  }

  /**
  * @name phoneNumberValidator
  * @description Phone Number Validation
  */
  static phoneNumberValidator(c: FormControl): ValidationErrors {
    // const isValidPhoneNumber = /^\d{3,3}-\d{3,3}-\d{3,3}$/.test(c.value);
    const isValidContactNumber = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
    const message = {
      'phoneNumber': {
        'message': 'The phone number must be valid (XXX-XXX-XXX, where X is a digit)'
      }
    };
    return isValidContactNumber ? null : message;
  }

  /**
  * @name zipCodeValidator
  * @description Zipcode Validation
  */

  static zipCodeValidator(zip): any {
    if (zip.pristine) {
      return null;
    }
    const ZIP_REGEXP = /^[0-9]{5}(?:-[0-9]{4})?$/;
    zip.markAsTouched();
    if (ZIP_REGEXP.test(zip.value)) {
      return null;
    }
    return {
      invalidZip: true
    };
  }

  /**
 * @name ssnValidator
 * @description SSN Validation
 */

  static ssnValidator(ssn): any {
    if (ssn.pristine) {
      return null;
    }
    const SSN_REGEXP = /^(?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
    ssn.markAsTouched();
    if (SSN_REGEXP.test(ssn.value)) {
      return null;
    }
    return {
      invalidSsn: true
    };
  }

  /**
    * @name urlValidator
    * @description URL Validation
    */
  static urlValidator(url): any {
    if (url.pristine) {
      return null;
    }
    const URL_REGEXP = /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    url.markAsTouched();
    if (URL_REGEXP.test(url.value)) {
      return null;
    }
    return {
      invalidUrl: true
    };
  }

  /**
  * @name passwordValidator
  * @description Password Validation
  */

  static matchPasswordValidator(group): any {
    const password = group.controls.password;
    const confirm = group.controls.confirm;
    if (password.pristine || confirm.pristine) {
      return null;
    }
    group.markAsTouched();
    if (password.value === confirm.value) {
      return null;
    }
    return {
      invalidPassword: true
    };
  }


  /**
  * @name confirmPasswordValidator
  * @description Confirm Password Validation
  */

  static confirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      // return null if controls haven't initialised yet
      if (!control || !matchingControl) {
        return null;
      }

      // return null if another validator has already found an error on the matchingControl
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return null;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  /**
   * @name ageRangeValidator
   * @description Age Range Validation
   */
  static ageRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
        return { 'ageRange': true };
      }
      return null;
    };
  }

}
