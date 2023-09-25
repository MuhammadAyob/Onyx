import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessonsearch'
})
export class LessonsearchPipe implements PipeTransform {

  transform(lessons: any[], searchText: string): any[] {
    if (!lessons || !searchText) {
      return lessons;
    }

    searchText = searchText.toLowerCase();

    return lessons.filter((lesson) => {
      // Customize this condition based on your lesson object structure.
      // For example, you might want to search by LessonName.
      return lesson.LessonName.toLowerCase().includes(searchText);
    });
  }

}
