import { Pipe, PipeTransform } from '@angular/core';
import { CourseOverview } from './Models/course-overview.model';

@Pipe({
  name: 'coursepipe'
})
export class CoursePipe implements PipeTransform {

  transform(sections: any[], searchTerm: string): any[] {
    if (!sections || !searchTerm) {
      return sections;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return sections.filter((section: any) => {
      return section.SectionName.toLowerCase().includes(lowerSearchTerm);
    });
  }

}
