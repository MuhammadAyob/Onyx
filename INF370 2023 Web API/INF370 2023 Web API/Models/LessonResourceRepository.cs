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
    public class LessonResourceRepository: ILessonResource
    {
        private readonly Entities db;

        public LessonResourceRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddLessonResource([FromBody] LessonResource lessonResource)
        {
            try
            {
                var exists = await db.LessonResources.Where(p=> p.ResourceFile == lessonResource.ResourceFile && p.LessonID == lessonResource.LessonID).FirstOrDefaultAsync();
                if(exists != null)
                {
                    return new { Status = 100, Message = "Lesson resource file exists under this lesson" };
                }

                if (await LessonResourceExists(lessonResource.ResourceName, lessonResource.LessonID))
                {
                    return new { Status = 404, Message = "Lesson resource exists under this lesson" };
                }

                db.LessonResources.Add(lessonResource);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Lesson Resource added" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteLessonResource(int id)
        {
            try
            {
                LessonResource lessonResource = await db.LessonResources.FindAsync(id);
                db.LessonResources.Remove(lessonResource);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Lesson Deleted" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "FK Constraint violated" };
            }
        }

        public async Task<object> GetLessonsResources(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                List<LessonResource> lessonResources = await db.LessonResources.Where(s => s.LessonID == id).ToListAsync();
                List<dynamic> lessonResourceList = new List<dynamic>();

                foreach (LessonResource lessonResource in lessonResources)
                {
                    dynamic obj = new ExpandoObject();
                    obj.LessonID = lessonResource.LessonID;
                    obj.ResourceID = lessonResource.ResourceID;
                    obj.ResourceName = lessonResource.ResourceName;
      
                   

                    lessonResourceList.Add(obj);
                }
                return lessonResourceList;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> MaintainLessonResource(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                LessonResource lessonResource = await db.LessonResources.Where(s => s.ResourceID == id).FirstOrDefaultAsync();

                dynamic obj = new ExpandoObject();
       
                obj.LessonID = lessonResource.LessonID;
                obj.ResourceID = lessonResource.ResourceID;
                obj.ResourceName = lessonResource.ResourceName;
                obj.ResourceFile = lessonResource.ResourceFile;

                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> MaintainResource(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.LessonResources.Where(x => x.ResourceID == id).FirstOrDefaultAsync();
                return obj;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateLessonResource(int id, LessonResource lessonResource)
        {
            try
            {
                var exists = await db.LessonResources.Where(p => p.ResourceFile == lessonResource.ResourceFile && p.LessonID == lessonResource.LessonID && p.ResourceID != id).FirstOrDefaultAsync();
                
                if (exists != null)
                {
                    return new { Status = 100, Message = "Lesson resource file exists under this lesson" };
                }

                var test =
                    await db.LessonResources
                    .Where(x => x.ResourceName == lessonResource.ResourceName && x.LessonID == lessonResource.LessonID && x.ResourceID != id)
                    .FirstOrDefaultAsync();

                if (test != null)
                {
                    return new { Status = 404, Message = "Lesson resource exists under this lesson" };
                }

                db.Entry(lessonResource).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Lesson Resource Updated" };
            }

            catch (Exception e)
            {
                // return new { Status = 500, Message = "Internal server error, please try again" };
                return e.ToString();
            }
        }

        private async Task<bool> LessonResourceExists(string name, int id)
        {
            var exists = await db.LessonResources.Where(p => p.ResourceName == name && p.LessonID==id).FirstOrDefaultAsync();
            return exists != null;
        }


    }
}