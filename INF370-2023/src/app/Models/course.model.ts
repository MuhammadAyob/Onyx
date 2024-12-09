export class Course{
    CourseID!:number;
    Name!:string;
    Description!:string;
    Image!:string | ArrayBuffer;
    CategoryID!:number;
    Active!:string;
    Preview!:string;

}

export class CoursePrice{
    PriceID!:number;
    Price!:number;
    CourseID!:number;
    Date!:string | any;
}