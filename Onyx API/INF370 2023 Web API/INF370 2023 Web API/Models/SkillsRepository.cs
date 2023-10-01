using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class SkillsRepository : ISkills
    {
        //Dependency injection

        private readonly Entities db;

        public SkillsRepository(Entities database)
        {
            this.db = database;
        }

        //validation
       
        private async Task<bool> SkillExists(int id)
        {
            return await db.Skills.CountAsync(e => e.SkillID == id) > 0;
        }

        private async Task<bool> SkillNameExists(string name, int typeID)
        {
            var exists = await db.Skills.Where(p => p.SkillName == name && p.SkillTypeID == typeID).FirstOrDefaultAsync();
            return exists != null;
        }

        /////////

        public async Task<object> GetSkill(string name)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;

                Skill skill = await db.Skills
                    .Where(x => x.SkillName == name)
                    .FirstOrDefaultAsync();

                if (skill == null)
                {
                    return new{Status = 500, Message = "Internal server error, please try again"};
                }

                return skill;
            }
            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }

        public async Task<object> GetSkillList()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Skills
                    .Include(s => s.SkillType)
                    .Select(s => new
                    {
                        SkillID = s.SkillID,
                        SkillName = s.SkillName,
                        SkillType = s.SkillType.SkillTypeName
                    })
                    .ToListAsync();
                return obj;
            }
            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }

        public async Task<object> GetSkills()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Skills
                   .Include(s => s.SkillType)
                   .Select(s => new
                   {
                       SkillID = s.SkillID,
                       SkillName = s.SkillName,
                       Description = s.Description,
                       SkillTypeID = s.SkillTypeID,
                       skillTypeName = s.SkillType.SkillTypeName
                   })
                   .ToListAsync();
                return obj;

             
            }
            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }

        public async Task<object> GetSkillsTypes()
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Skills
                     .Include(s => s.SkillType)
                     .Select(s => new
                     {
                         skillID = s.SkillID,
                         skillName = s.SkillName,
                         skillDesc = s.Description,
                         skillTypeID = s.SkillTypeID,
                         skillTypeName = s.SkillType.SkillTypeName
                     })
                     .ToListAsync();
                return obj;
            }
            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }

        public async Task<object> UpdateSkill(int id, Skill skill)
        {
            try
            {
                var sk = await db.Skills.Where(x => x.SkillName == skill.SkillName && x.SkillTypeID == skill.SkillTypeID && x.SkillID != id).FirstOrDefaultAsync();
                if (sk != null)
                {
                    return new { Status = 400, Message = "Skill exists" };
                }

                db.Entry(skill).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return new { Status =200, Message = "Skill added" };
            }

            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }

        public async Task<object> AddSkill([FromBody] Skill skill)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
               
                //check exists

                if (await SkillNameExists(skill.SkillName, skill.SkillTypeID))
                {
                    return new { Status = 405, Message = "Skill exists" };
                }

                db.Skills.Add(skill);
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "Skill added" };


            }
            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }

        public async Task<object> DeleteSkill(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
               
                Skill skill = await db.Skills.FindAsync(id);
                if (skill == null)
                {
                    return new
                    {
                        Status = 500,
                        Message = "Skill not found"
                    };
                }

                
                db.Skills.Remove(skill);
                await db.SaveChangesAsync();
                
                return new{ Status = 200, Message = "Skill deleted" };
            }

            catch (Exception)
            {
                return new
                {
                    Status = 501,
                    Message = "FK Constraint violated, skill currently in use in parts of system"
                };
            }
        }

        public async Task<object> GetSkillAssignedCheck(int id)
        {
            try
            {
                List<EmployeeSkill> nameList = new List<EmployeeSkill>();
                nameList = await db.EmployeeSkills.Where(s => s.SkillID == id).ToListAsync();

                if (nameList.Count == 0)
                {
                    return null;
                }
                else
                {
                    List<dynamic> returnList = new List<dynamic>();
                    foreach (EmployeeSkill skill in nameList)
                    {
                        Employee emp = db.Employees.Find(skill.EmployeeID);
                        returnList.Add(emp.Name + " " + emp.Surname);
                    }
                    return returnList;
                }
            }

            catch (Exception)
            {
                return new
                {
                    Status = 500,
                    Message = "Internal server error, please try again"
                };
            }
        }
    }
}