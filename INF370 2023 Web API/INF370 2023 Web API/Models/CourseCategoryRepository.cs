using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class CourseCategoryRepository: ICourseCategory
    {
        private readonly Entities db;

        public CourseCategoryRepository(Entities database)
        {
            this.db = database;
        }

        private async Task<bool> CategoryNameExists(string name)
        {
            var exists = await db.CourseCategories.Where(p => p.Category == name).FirstOrDefaultAsync();
            return exists != null;
        }

        public async Task<object> AddCategory([FromBody] CourseCategory courseCategory)
        {
            if (await CategoryNameExists(courseCategory.Category))
            {
                return new { Status = 404, Message = "Category name in use" };
            }
            
            try
            {
                db.CourseCategories.Add(courseCategory);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Category added" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateCategory(int id, CourseCategory courseCategory)
        {
            try
            {
                var _category = await 
                    db.CourseCategories
                    .Where(x => x.Category == courseCategory.Category && x.CategoryID != id)
                    .FirstOrDefaultAsync();

                if (_category != null)
                {
                    return new { Status = 404, Message = "Category name in use" };
                }

                else
                {
                    db.Entry(courseCategory).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                    return new { Status = 200, Message = "Category updated" };
                }

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteCategory(int id)
        {
            try
            {
                CourseCategory category = await db.CourseCategories.FindAsync(id);

                if(category == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                db.CourseCategories.Remove(category);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Category removed" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "FK restraint" };
            }
        }

        public async Task<object> GetCategories()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.CourseCategories.ToListAsync();
                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetCategoryID(int id)
        {
            try
            {
                CourseCategory category = await db.CourseCategories.FindAsync(id);

                if (category == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                return category;


            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetCategory(string name)
        {
            try
            {
                CourseCategory category = 
                    await db.CourseCategories
                    .Where(x => x.Category == name)
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                return category;

            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}