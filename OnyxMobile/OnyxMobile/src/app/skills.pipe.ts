import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skills'
})
export class SkillsPipe implements PipeTransform {

  transform(data: any[], filter: string): any[] {
    if (!data || !filter) {
        return data!;
    }
  return data = data.filter(s => s.SkillName.toLowerCase().includes(filter.toLowerCase()) || 
  s.SkillTypeName.toLowerCase().includes(filter.toLowerCase()))
}

}
