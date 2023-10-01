using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class RatingRepository : IRatings
    {
        private readonly Entities db;

        public RatingRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddRating(CourseRating rating)
        {
            try
            {
                db.CourseRatings.Add(rating);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Rating added" };
            }

            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public async Task<object> DeleteRating(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var rating = await db.CourseRatings.Where(x => x.RatingID == id).FirstOrDefaultAsync();
                db.CourseRatings.Remove(rating);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Rating deleted" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error. Please try again" };
            }
        }

        public async Task<object> GetCoursesToRate(int studentId)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;

                var coursesToRate = await db.Courses
                    .Join(db.StudentCourses,
                        course => course.CourseID,
                        studentCourse => studentCourse.CourseID,
                        (course, studentCourse) => new { Course = course, StudentCourse = studentCourse })
                    .Where(joinResult => joinResult.StudentCourse.StudentID == studentId)
                    .Where(joinResult => !db.CourseRatings
                        .Any(rating => rating.CourseID == joinResult.Course.CourseID && rating.StudentID == studentId))
                    .Select(joinResult => new
                    {
                        CourseID = joinResult.Course.CourseID,
                        Name = joinResult.Course.Name
                    })
                    .ToListAsync();

                return coursesToRate;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error. Please try again" };
            }
        }


        public async Task<object> UpdateRating(int id, CourseReview rating)
        {
            try
            {
                var review = await db.CourseRatings.Where(x => x.RatingID == id).FirstOrDefaultAsync();
                review.Rating = rating.Rating;
                review.Comment = rating.Comment;

                db.Entry(review).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "Rating updated" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error. Please try again" };
            }
        }
    }
}