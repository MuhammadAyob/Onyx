import { Qualification } from "./qualification.model";
import { Skill } from "./skill.model";

export class Employee{
    EmployeeID!:number;
    UserID!: number;
    DepartmentID!: number;
    Name!: string;
    Surname!: string;
    Email!: string;
    Phone!: string;
    RSAIDNumber!: string;
    Deleted!: string;
    TitleID!:number;
    Biography!:string;
    Skills!: Skill[];
    Qualifications!: Qualification[];
}

export class EmployeeListForCourses{
    EmployeeID!:number;
    Name!:string;
    Surname!:string;
    Email!:string;
}