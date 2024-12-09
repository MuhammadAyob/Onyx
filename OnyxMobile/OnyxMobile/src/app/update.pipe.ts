import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'update'
})
export class UpdatePipe implements PipeTransform {
  transform(data: any[], filter: string): any[] {
    if (!data || !filter) {
        return data!;
    }
  return data = data.filter(s => s.UpdateSubject.toLowerCase().includes(filter.toLowerCase()) || 
  s.UpdateDescription.toLowerCase().includes(filter.toLowerCase()))
}

}
