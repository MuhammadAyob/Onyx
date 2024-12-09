import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resourcesearch'
})
export class ResourcesearchPipe implements PipeTransform {
  
  transform(resources: any[], searchText: string): any[] {
    if (!resources || !searchText) {
      return resources;
    }

    searchText = searchText.toLowerCase();

    return resources.filter((resource) => {
      // Customize this condition based on your lesson resource object structure.
      // For example, you might want to search by ResourceName.
      return resource.ResourceName.toLowerCase().includes(searchText);
    });
  }
}
