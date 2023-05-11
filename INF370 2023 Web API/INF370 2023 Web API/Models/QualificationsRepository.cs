using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class QualificationsRepository : IQualifications
    {
        //Dependency injection

        private readonly Entities db;

        public QualificationsRepository(Entities database)
        {
            this.db = database;
        }

        

        // Validation checks /// / / / / /   //  / / /  /// 

        private async Task <bool> QualificationExists(int id)
        {
            return await db.Qualifications.CountAsync(e => e.QualificationID == id) > 0;
        }

        private async Task <bool> QualificationNameExists(string name)
        {
            var exists =await  db.Qualifications.Where(p => p.QualificationName == name).FirstOrDefaultAsync();
            return exists != null;
        }

        private async Task <bool> maintainCheck(int id, string name)
        {
            Qualification quali = await db.Qualifications.FindAsync(id);

            if (quali.QualificationName == name)
            {
                return true;
            }

            else
            {
                return false;
            }
        }

        // Validation checks /// / / / / /   //  / / /  /// 

        public async Task<object> AddQualification([FromBody] Qualification qualification)
        {
            //check exists

            if (await QualificationNameExists(qualification.QualificationName))
            {
                return new { Status = 403, Message = "Qualification exists" };
            }

            try
            {
                db.Qualifications.Add(qualification);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Qualification added" };

            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };

            }
        }

        public async Task<object> GetQualifications()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Qualifications.ToListAsync();
                return obj;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateQualification(int id, Qualification qualification)
        {
            var _quali = await db.Qualifications.Where(x => x.QualificationName == qualification.QualificationName && x.QualificationID != id).FirstOrDefaultAsync();

            if (_quali != null)
            {

                return new { Status = 403, Message = "Qualification exists" };
            }
         

            try
            {
                db.Entry(qualification).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Qualification updated" };

            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Cannot find qualification id to update" };

            }
        }

        public async Task<object> DeleteQualification(int id)
        {
            try
            {
                Qualification qualification = await db.Qualifications.FindAsync(id);
                if (qualification == null)
                {
                    return new { Status = 500, Message = "Qualification id doesn't exist" };
                }

                db.Qualifications.Remove(qualification);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Qualification deleted" };
            }

            catch (Exception)
            {
                return new { Status = 501, Message = "FK violation" };
            }
        }

        public async Task<bool> ValidateQualification(int id, Qualification qualification)
        {
            if (await QualificationNameExists(qualification.QualificationName))
            {
                if (await maintainCheck(id, qualification.QualificationName) == true)
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

        public async Task<object> GetQualificationAssignedCheck(int id)
        {
            try
            {
                List<EmployeeQualification> nameList = new List<EmployeeQualification>();
                nameList = await db.EmployeeQualifications.Where(s => s.QualificationID == id).ToListAsync();

                if (nameList.Count == 0)
                {
                    return null;
                }
                else
                {
                    List<dynamic> returnList = new List<dynamic>();
                    foreach (EmployeeQualification item in nameList)
                    {
                        Employee emp = db.Employees.Find(item.EmployeeID);
                        returnList.Add(emp.Name + " " + emp.Surname);
                    }
                    return returnList;
                }
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetQualificationID(int id)
        {
            try
            {
                Qualification qualification = await db.Qualifications.FindAsync(id);
                if (qualification == null)
                {
                    return new { Status = 500, Message = "Qualification id doesn't exist" };
                }

                return qualification;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetQualification(string QualificationName)
        {
            try
            {
                Qualification qualification = await db.Qualifications
                .Where(x => x.QualificationName == QualificationName)
                .FirstOrDefaultAsync();

                if (qualification == null)
                {
                    return new { Status = 500, Message = "Qualification doesn't exist" };
                }

                return qualification;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}