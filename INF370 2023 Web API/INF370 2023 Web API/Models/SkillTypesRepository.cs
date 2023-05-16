using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class SkillTypesRepository : ISkillTypes
    {
        //Dependency injection

        private readonly Entities db;

        public SkillTypesRepository(Entities database)
        {
            this.db = database;
        }

        // Validation

        private async Task<bool> SkillTypeExists(int id)
        {
            return await db.SkillTypes.CountAsync(e => e.SkillTypeID == id) > 0;
        }

        private async Task<bool> SkillTypeNameExists(string name)
        {
            var exists = await db.SkillTypes.Where(p => p.SkillTypeName == name).FirstOrDefaultAsync();
            return exists != null;
        }

        private async Task<bool> maintainCheck(int id, string name)
        {
            SkillType type = await db.SkillTypes.FindAsync(id);

            if (type.SkillTypeName == name)
            {
                return true;
            }

            else
            {
                return false;
            }
        }

        // Validation end

        public async Task<object> GetSkillType(string SkillTypeName)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
               
                SkillType skillType = await db.SkillTypes
                    .Where(x => x.SkillTypeName == SkillTypeName)
                    .FirstOrDefaultAsync();
                if (skillType == null)
                {
                    return new { Status = 404, Message = "SkillType not found" };
                }

                return skillType;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetSkillTypeName(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                SkillType skilltype = await db.SkillTypes.Where(s => s.SkillTypeID == id).FirstOrDefaultAsync();
                return skilltype;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
           
        }

        public async Task<object> GetSkillTypes()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.SkillTypes.ToListAsync();
                return obj;
            }

            catch (Exception)
            {
                return new { Statis = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<bool> ValidateSkillType(int id,SkillType skillType)
        {
            
            
                db.Configuration.ProxyCreationEnabled = false;
                if (await SkillTypeNameExists(skillType.SkillTypeName))
                {
                    if (await maintainCheck(id, skillType.SkillTypeName) == true)
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

        public async Task<object> UpdateSkillType(int id, SkillType skillType)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;

                var st = await db.SkillTypes.Where(x => x.SkillTypeName == skillType.SkillTypeName && x.SkillTypeID != id).FirstOrDefaultAsync();

                if (st!= null)
                {
                    return new { Status = 404, Message = "Skill Type Updated" };
                }

                db.Entry(skillType).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Skill Type Updated" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> AddSkillType([FromBody] SkillType skillType)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;

                if (await SkillTypeNameExists(skillType.SkillTypeName))
                {
                    return new { Status = 400, Message = "SkillType Exists" };
                }

                db.SkillTypes.Add(skillType);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Skill Type added" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteSkillType(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
               
                SkillType skillType = await db.SkillTypes.FindAsync(id);
                if (skillType == null)
                {
                    return new { Status = 404, Message = "Skill Type not found" };
                }

                db.SkillTypes.Remove(skillType);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Skill Type deleted" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Skill Type in use, FK Constraint violated" };
            }
        }
    }
}