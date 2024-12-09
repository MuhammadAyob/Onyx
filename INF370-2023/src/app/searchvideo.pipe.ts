import { Pipe, PipeTransform } from '@angular/core';
import { InstructionalVideo } from './Models/training-video.model';

@Pipe({
    name: 'videoPipe',
    pure: false
  })
  export class VideoPipePipe implements PipeTransform {
  
    transform(data: InstructionalVideo[], filter: string): InstructionalVideo[] {
      if (!data || !filter) {
          return data!;
      }
    return data = data.filter(s => s.VideoName.toLowerCase().includes(filter.toLowerCase()))
  }
  }