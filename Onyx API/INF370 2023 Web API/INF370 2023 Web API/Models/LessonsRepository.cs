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
    public class LessonsRepository: ILessons
    {
        private readonly Entities db;

        public LessonsRepository(Entities database)
        {
            this.db = database;
        }
        
        private async Task<bool> LessonNameExists(string name, int id)
        {
            var exists = await db.Lessons.Where(p => p.LessonName == name && p.SectionID == id).FirstOrDefaultAsync();
            return exists != null;
        }

        public async Task<object> GetSectionLessons(int id)
        {
            try
            {
                List<Lesson> lessons = await db.Lessons.Where(s => s.SectionID == id).ToListAsync();
                List<dynamic> lessonList = new List<dynamic>();

                foreach (Lesson lesson in lessons)
                {
                    dynamic obj = new ExpandoObject();
                    obj.LessonID = lesson.LessonID;
                    obj.SectionID = lesson.SectionID;
                    obj.LessonName = lesson.LessonName;
                    obj.LessonDescription = lesson.LessonDescription;
                    obj.VideoID = lesson.VideoID;

                    lessonList.Add(obj);
                }
                return lessonList;
            }
            
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> MaintainLesson(int id)
        {
            try
            {
                Lesson lesson = await db.Lessons.Where(s => s.LessonID == id).FirstOrDefaultAsync();

                dynamic obj = new ExpandoObject();
                obj.LessonID = lesson.LessonID;
                obj.SectionID = lesson.SectionID;
                obj.LessonName = lesson.LessonName;
                obj.LessonDescription = lesson.LessonDescription;
                obj.VideoID = lesson.VideoID;

                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> AddLesson([FromBody] Lesson lesson)
        {
            try
            {
                var course = await db.Sections.Where(x => x.SectionID == lesson.SectionID).FirstOrDefaultAsync();
                var isDuplicate = await db.Lessons.Where(l => l.Section.Course.CourseID == course.CourseID && l.VideoID == lesson.VideoID).FirstOrDefaultAsync();

                if (isDuplicate != null)
                {
                    return new { Status = 100, Message = "Lesson video exists in course" };
                }

                if (await LessonNameExists(lesson.LessonName, lesson.SectionID))
                {
                    return new { Status = 404, Message = "Lesson name exists under this section" };
                }

                db.Lessons.Add(lesson);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Lesson added" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateLesson(int id, Lesson lesson)
        {
            try
            {
                var course = await db.Sections.Where(x => x.SectionID == lesson.SectionID).FirstOrDefaultAsync();
                var isDuplicate = await db.Lessons.Where(l => l.Section.Course.CourseID == course.CourseID && l.VideoID == lesson.VideoID && l.LessonID != id).FirstOrDefaultAsync();

                if (isDuplicate != null)
                {
                    return new { Status = 100, Message = "Lesson video exists in course" };
                }

                var test =
                    await db.Lessons
                    .Where(x => x.LessonName == lesson.LessonName && x.SectionID == lesson.SectionID && x.LessonID != id)
                    .FirstOrDefaultAsync();

                if (test != null)
                {
                    return new { Status = 404, Message = "Lesson name exists under this section" };
                }

                db.Entry(lesson).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Lesson Updated" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteLesson(int id)
        {
            try
            {
                Lesson lesson = await db.Lessons.FindAsync(id);
                db.Lessons.Remove(lesson);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Lesson Deleted" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "FK Constraint violated" };
            }
        }


    }
}