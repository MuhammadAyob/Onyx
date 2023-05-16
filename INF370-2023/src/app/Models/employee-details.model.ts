export class EmployeeDetails{
Employee!:{
    EmployeeID: number;
    UserID: number;
    UserRoleID: number;
    DepartmentID: number;
    Name: string;
    Surname: string;
    Email: string;
    Phone: string;
    RSAIDNumber: string;
    Deleted: string;
    TitleID:number;
    Biography:string;
    Image:string | ArrayBuffer;
};
Skills!: number | null;
Qualifications!: number | null;
}