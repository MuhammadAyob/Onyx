import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name:'VimeoUrl'
})
export class VimeoUrlPipe{
constructor(protected _sanitizer:DomSanitizer){}

transform(value:any, args?:any):any {

let url = "https://player.vimeo.com/video/"+ value

return this._sanitizer.bypassSecurityTrustResourceUrl(url);

}
}