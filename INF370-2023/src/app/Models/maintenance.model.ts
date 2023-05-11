export class Maintenance{
    MaintenanceID!:number;
    UserID!:number;
    MaintenanceTypeID!:number;
    MaintenanceStatusID!:number;
    MaintenancePriorityID!:number;
    Description!:string;
    Location!:string;
    DateLogged:any;
    DateResolved:any;
    Image!:string | ArrayBuffer;
}