export class CourseOverview {
    CourseID!: number;
    CourseName!: string;
    Sections!: Section[];
  }
  
  export class Section {
    SectionID!: number;
    SectionName!: string;
    SectionDescription!: string;
    Lessons!: Lesson[];
  }
  
  export class Lesson {
    LessonID!: number;
    LessonName!: string;
    LessonDescription!: string;
    VideoID!: string;
    LessonResources!: Resource[];
  }
  
  export class Resource {
    ResourceID!: number;
    ResourceName!: string;
    ResourceFile!: string;
  }
  