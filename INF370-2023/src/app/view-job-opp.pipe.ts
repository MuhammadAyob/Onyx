import { Pipe, PipeTransform } from '@angular/core';
import { JobOpportunities } from './Models/JobOpportunities.model';

@Pipe({
  name: 'viewJobOpp'
})
export class ViewJobOppPipe implements PipeTransform {

  transform(data: JobOpportunities[], filter: string): JobOpportunities[] {
    if (!data || !filter) {
        return data;
    }
  return data = data.filter(s => s.JobOppTitle.toLowerCase().includes(filter.toLowerCase()))
}

}
