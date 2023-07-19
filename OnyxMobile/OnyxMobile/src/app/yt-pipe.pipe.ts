import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'ytPipe'
})
export class YtPipePipe implements PipeTransform {
  constructor(protected _sanitizer:DomSanitizer){}
  transform(value:any, args?:any):any {
  
      let url = "https://www.youtube.com/embed/" + value
      
      return this._sanitizer.bypassSecurityTrustResourceUrl(url);
      
  }
}
