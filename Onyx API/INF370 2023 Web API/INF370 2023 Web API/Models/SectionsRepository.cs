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
    public class SectionsRepository: ISections
    {
        private readonly Entities db;

        public SectionsRepository(Entities database)
        {
            this.db = database;
        }

        private async Task<bool> SectionNameExists(string name, int id)
        {
            var exists = await db.Sections.Where(p => p.SectionName == name && p.CourseID==id).FirstOrDefaultAsync();
            return exists != null;
        }

        public async Task<object> AddSection([FromBody] Section section)
        {
            try
            {
                if(await SectionNameExists(section.SectionName, section.CourseID))
                {
                    return new { Status = 404, Message = "Section name exists under this course" };
                }

                db.Sections.Add(section);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Section added" };
            }

            catch (Exception e)
            {
                return e.ToString();
               // return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetCourseSections(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                List<Section> sections = await db.Sections.Where(s => s.CourseID == id).ToListAsync();
                List<dynamic> sectionList = new List<dynamic>();

                foreach (Section section in sections)
                {
                    dynamic obj = new ExpandoObject();
                    obj.SectionID = section.SectionID;
                    obj.CourseID = section.CourseID;
                    obj.SectionName = section.SectionName;
                    obj.SectionDescription = section.SectionDescription;
                    
                    sectionList.Add(obj);
                }
                return sectionList;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> MaintainSection(int id)
        {
            try
            {
                Section section = await db.Sections.Where(s => s.SectionID == id).FirstOrDefaultAsync();

                dynamic obj = new ExpandoObject();
                obj.SectionID = section.SectionID;
                obj.CourseID = section.CourseID;
                obj.SectionName = section.SectionName;
                obj.SectionDescription = section.SectionDescription;

                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateSection(int id, Section section)
        {
            try
            {
                var test = 
                    await db.Sections
                    .Where(x => x.SectionName == section.SectionName && x.CourseID==section.CourseID && x.SectionID!=id)
                    .FirstOrDefaultAsync();

                if (test != null)
                {
                    return new { Status = 404, Message = "Section name exists under this course" };
                }

                db.Entry(section).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Section Updated" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteSection(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                Section section = await db.Sections.FindAsync(id);
                db.Sections.Remove(section);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Section Deleted" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "FK Constraint violated" };
            }
        }
    }
}