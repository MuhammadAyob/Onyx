using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class StudentsRepository : IStudents
    {

        private readonly Entities db;

        public StudentsRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> DeactivateStudent(int id)
        {
            try
            {
                var student = await db.Students.FindAsync(id);
                student.Deleted = "True";

                db.Entry(student).State = EntityState.Modified;
                await db.SaveChangesAsync();

                var user = await db.Users.Where(x => x.UserID == student.UserID).FirstOrDefaultAsync();
                user.Activity = "False";
                db.Entry(user).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Student deactivated" };
            }
            catch(Exception ex)
            {
                return ex.ToString();
            }
        }

        public async Task<object> DeleteStudent(int id, Student student)
        {
            try
            {
                Student stud = await db.Students.FindAsync(id);
                stud.Deleted = "True";
                db.Entry(stud).State = EntityState.Modified;
                await db.SaveChangesAsync();

                User user = await db.Users.Where(x => x.UserID == stud.UserID).FirstOrDefaultAsync();
                user.Activity = "False";
                db.Entry(stud).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Student successfully deactivated" };
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<object> GetStudentID(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                User user = await db.Users.FindAsync(id);
                Student student = await db.Students.Where(x => x.UserID == user.UserID).FirstOrDefaultAsync();

                if(student == null)
                {
                    return new { Status = 404, Message = "Student not found" };
                }

                int ID = student.StudentID;

                return ID;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetStudentName(int id)
        {
            try 
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Students.FindAsync(id);
                return obj;
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<object> GetStudents()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Students.Where(za=>za.Deleted == "False")
                    .Join(db.Titles,
                        student => student.TitleID,
                        title => title.TitleID,
                        (student, title) => new { Student = student, Title = title })
                    .Select(st => new
                    {
                        StudentID = st.Student.StudentID,
                        Title = st.Title.TitleName,
                        Name = st.Student.Name,
                        Surname = st.Student.Surname,
                        Email = st.Student.Email,
                        Phone = st.Student.Phone
                       
                    })
                    .ToListAsync();
               
                return obj;

            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<object> UpdateStudent(int id, Student student)
        {
            try
            {
                db.Entry(student).State = EntityState.Modified;
                await db.SaveChangesAsync();

                User user = await db.Users.FindAsync(student.UserID);
                user.Username = student.Email;
                db.Entry(user).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new
                {
                    Status = 200,
                    Message = "Student Successfully updated"
                };
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }
    }
}