using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class DepartmentsRepository : IDepartments

    {

        //Dependency injection

        private readonly Entities db;

        public DepartmentsRepository(Entities database)
        {
            this.db = database;
        }
       
        
        // Begin coding

        public async Task<object> AddDepartment([FromBody] Department department)
        {
            try
            {

                if(await DepartmentNameExists(department.DepartmentName))
                {
                    return new { Status = 401, Message = "Department name exists" };
                }

                db.Departments.Add(department);
                await db.SaveChangesAsync();
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 200;
                toReturn.Message = "Department successfully added";
                return toReturn;
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<object> UpdateDepartment(int id, Department department)
        {
            try
            {
                var _dep = await db.Departments.Where(x => x.DepartmentName == department.DepartmentName && x.DepartmentID != id).FirstOrDefaultAsync();
               
                if (_dep != null)
                {
                    return new { Status = 401, Message = "Department exists" };
                }
                
                db.Entry(department).State = EntityState.Modified;
                await db.SaveChangesAsync();
                
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 200;
                toReturn.Message = "Department successfully updated";
                return toReturn;
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<object> DeleteDepartment(int id)
        {
            Department department = await db.Departments.FindAsync(id);

            if (department == null)
            {
                return new { Status = 404, Message = "Not found" };
            }

            try 
            {
                try
                {
                    db.Departments.Remove(department);
                    await db.SaveChangesAsync();
                    return new { Status = 200, Message = "Department removed" };
                }

                catch (Exception)
                {
                    dynamic toReturn = new ExpandoObject();
                    toReturn.Status = 501;
                    toReturn.Message = "FK Constraint violated, cannot delete as department is being used elsewhere in the system";
                    return toReturn;
                }
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
            
        }

        public async Task<object> GetDepartment(string name)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                Department department = await db.Departments
                    .Where(x => x.DepartmentName == name)
                    .FirstOrDefaultAsync();

                if (department == null)
                {
                    return new { Status = 404, Message = "Department not found" };
                }

                return department;
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<object> GetDepartmentID(int id)
        {
            try 
            {
                db.Configuration.ProxyCreationEnabled = false;
                Department department = await db.Departments.Where(x=>x.DepartmentID==id).FirstOrDefaultAsync();
                if (department == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                return department;
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
           
        }

        public async Task<object> GetDepartments()
        {
            try 
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Departments.ToListAsync();
                return obj;
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<bool> ValidateDepartment(int id, Department department)
        {
            if (await DepartmentNameExists(department.DepartmentName))
            {
                if(await maintainCheck(id, department.DepartmentName) == true)
                {
                    return true;
                }

                else
                {
                    return false;
                }
            }

            else
            {
                return true;
            }
        }

        // Conditional checks

        private async Task<bool> DepartmentNameExists(string name)
        {
            var exists = await db.Departments.Where(p => p.DepartmentName == name).FirstOrDefaultAsync();
            return exists != null;
        }

        private async Task<bool> DepartmentIDExists(int id)
        {
            return await db.Departments.CountAsync(e => e.DepartmentID == id) > 0;
        }

        private async Task<bool> maintainCheck(int id, string name)
        {
            Department dept = await db.Departments.FindAsync(id);

            if (dept.DepartmentName == name)
            {
                return true;
            }

            else
            {
                return false;
            }
        }

     



    }
}