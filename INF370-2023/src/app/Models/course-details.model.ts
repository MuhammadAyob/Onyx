export class CourseDetails{
    CourseID!:number;
    Name!:string;
    Description!:string;
    Image!:string | ArrayBuffer;
    CategoryID!:number;
    Active!:string;
    Preview!:string;
    Price!:number | any;
    CourseAssistants!:number[]|null;
}