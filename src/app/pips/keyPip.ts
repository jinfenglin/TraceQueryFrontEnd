import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value: any, args: string[]): any {
    const keys = [];
    for (let i = 1; i < arguments.length; i++) {
      const innerObjName = arguments[i];
      for (const key of Object.keys(value[innerObjName])) {
        keys.push(key);
      }
    }
    return keys;
  }
}
