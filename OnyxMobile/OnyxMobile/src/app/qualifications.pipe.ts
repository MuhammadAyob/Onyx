import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qualifications'
})
export class QualificationsPipe implements PipeTransform {

  transform(data: any[], filter: string): any[] {
    if (!data || !filter) {
        return data!;
    }
  return data = data.filter(s => s.QualificationName.toLowerCase().includes(filter.toLowerCase()))
}

}
