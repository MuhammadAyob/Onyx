using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class CoursesRepository: ICourses
    {
        private readonly Entities db;

        public CoursesRepository(Entities database)
        {
            this.db = database;
        }

        // Conditional checks

        private async Task<bool> CourseNameExists(string name)
        {
            var exists = await db.Courses.Where(p => p.Name == name).FirstOrDefaultAsync();
            return exists != null;
        }

        public async Task<object> AddCourse(CourseDetails course)
        {

            
            try
            {
                if(await CourseNameExists(course.Name))
                {
                    return new { Status = 404, Message = "Course Exists" };
                }
                
                Course _course = new Course();
                _course.CourseID = 0;
                _course.Name = course.Name;
                _course.Description = course.Description;
                _course.Image = course.Image;
                _course.CategoryID = course.CategoryID;
                _course.Active = course.Active;

                db.Courses.Add(_course);
                await db.SaveChangesAsync();

                // retrieve course ID
                Course newCourseID = await db.Courses.Where(x => x.Name == course.Name).FirstOrDefaultAsync();
                var _courseID = newCourseID.CourseID;

                // Add to course price table
                CoursePrice obj = new CoursePrice();
                
                obj.PriceID = 0;
                var zz = Math.Round(course.Price, 2);
                obj.Price = zz;
                obj.CourseID = _courseID;
                obj.Date = DateTime.Now;
                
                db.CoursePrices.Add(obj);
                await db.SaveChangesAsync();

               
                // add course assistants
                foreach(int item in course.CourseAssistants)
                {
                    CourseAssistant tutors = new CourseAssistant();
                    tutors.EmployeeID = item;
                    tutors.CourseID = _courseID;
                    db.CourseAssistants.Add(tutors);
                    await db.SaveChangesAsync();
                }

                return new { Status = 200, Message = "Course Added" };
            }
            
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        public async Task<object> GetCourseAssistants(int id)
        {
            try
            {
                // db.Configuration.ProxyCreationEnabled = false;
                // List<dynamic> listEmployees = new List<dynamic>();
                //  List<CourseAssistant> courses = await db.CourseAssistants.Where(s => s.CourseID == id).ToListAsync();

                //  foreach(CourseAssistant course in courses)
                //  {
                //      dynamic obj = new ExpandoObject();
                //       db.Configuration.ProxyCreationEnabled = false;
                //      var employee = await db.Employees.Where(x => x.EmployeeID == course.EmployeeID).Select(x => new
                //      {
                //          EmployeeID = x.EmployeeID,
                //          Name = x.Name,
                //          Surname = x.Surname,
                //         Email = x.Email
                //      }).ToListAsync();

                //     obj.Employee = employee;
                //      listEmployees.Add(obj);
                //  }

                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.CourseAssistants
                    .Include(s => s.Employee)
                    .Where(x => x.CourseID == id).Select(z => new
                    {
                        Name = z.Employee.Name,
                        Surname = z.Employee.Surname,
                        Email = z.Employee.Email,
                        Image = z.Employee.Image,
                        Biography = z.Employee.Biography
                    }).ToListAsync();

                return obj;
           

                // return listEmployees;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> MaintainCourse(int id)
        {
            try
            {
                dynamic obj = new ExpandoObject();
                Course course = await db.Courses.Where(x => x.CourseID == id).FirstOrDefaultAsync();

                obj.CourseID = course.CourseID;
                obj.Name = course.Name;
                obj.Description = course.Description;
                obj.Image = course.Image;
                obj.CategoryID = course.CategoryID;
                obj.Active = course.Active;

                // RETRIEVE COURSE PRICE
                
                var price = await db.CoursePrices.Where(x => x.CourseID == id).OrderByDescending(z => z.Date).FirstOrDefaultAsync();
                
                // CARRY ON

                obj.PriceID = price.PriceID;
                obj.Price = price.Price;

                // GET EMPLOYEES ASSIGNED
                List<int> employeeIDs = new List<int>();
                List<CourseAssistant> cou = await db.CourseAssistants.Where(x => x.CourseID == course.CourseID).ToListAsync();

                foreach(CourseAssistant co in cou)
                {
                    Employee employee = await db.Employees.Where(x => x.EmployeeID == co.EmployeeID).FirstOrDefaultAsync();
                    var EmployeeID = employee.EmployeeID;
                    employeeIDs.Add(EmployeeID);
                }

                obj.Employees = employeeIDs;

                return obj;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetCourseDetails()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                List<Course> courses = await db.Courses.ToListAsync();
                List<dynamic> courseList = new List<dynamic>();

                foreach(Course course in courses)
                {
                    dynamic obj = new ExpandoObject();

                    obj.CourseID = course.CourseID;
                    obj.Name = course.Name;
                    obj.Description = course.Description;
                    obj.Image = course.Image;
                    obj.CategoryID = course.CategoryID;
                    obj.Active = course.Active;

                    // RETRIEVE COURSE PRICE

                    var price = await db.CoursePrices.Where(x => x.CourseID == course.CourseID).OrderByDescending(z => z.Date).FirstOrDefaultAsync();

                    // CARRY ON

                   // obj.PriceID = price.PriceID;
                    obj.Price = price.Price;

                    // Get employees assigned

                    List<int> employeeIDs = new List<int>();
                    List<CourseAssistant> cou = await db.CourseAssistants.Where(x => x.CourseID == course.CourseID).ToListAsync();

                    foreach(CourseAssistant co in cou)
                    {
                        Employee employee = await db.Employees.Where(x => x.EmployeeID == co.EmployeeID).FirstOrDefaultAsync();
                        var EmployeeID = employee.EmployeeID;
                        employeeIDs.Add(EmployeeID);
                    }

                    obj.CourseAssistants = employeeIDs;
                    courseList.Add(obj);


                }

                return courseList;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateCourse(int id, CourseDetails course)
        {
            try
            {
                var test = await db.Courses.Where(x => x.Name == course.Name && x.CourseID != id).FirstOrDefaultAsync();
                if (test != null)
                {
                    return new { Status = 404, Message = "Course Name in use" };
                }

                else
                {
                    Course cour = await db.Courses.FindAsync(id);
                    cour.CourseID = course.CourseID;
                    cour.Name = course.Name;
                    cour.Description = course.Description;
                    cour.Image = course.Image;
                    cour.CategoryID = course.CategoryID;
                    cour.Active = course.Active;

                    db.Entry(cour).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    // Course Price

                    var findprice = await db.CoursePrices.Where(x => x.CourseID == id).OrderByDescending(z => z.Date).FirstOrDefaultAsync();

                    if(findprice.Price != course.Price)
                    {
                        CoursePrice obj = new CoursePrice();
                        obj.PriceID = 0;
                        var zz = Math.Round(course.Price, 2);
                        obj.Price = zz;
                        obj.CourseID = course.CourseID;
                        obj.Date = DateTime.Now;

                        db.CoursePrices.Add(obj);
                        await db.SaveChangesAsync();
                    }


                    List<CourseAssistant> existingEmployees = await db.CourseAssistants.Where(x => x.CourseID == id).ToListAsync();
                    List<CourseAssistant> newEmployees = new List<CourseAssistant>();

                    foreach(int item in course.CourseAssistants)
                    {
                        CourseAssistant couAssistant = new CourseAssistant();
                        CourseAssistant couAss = await db.CourseAssistants.Where(x => x.CourseID == course.CourseID && x.EmployeeID == item).FirstOrDefaultAsync();

                        if(couAss == null)
                        {
                            couAssistant.EmployeeID = item;
                            couAssistant.CourseID = course.CourseID;
                            db.CourseAssistants.Add(couAssistant);
                            newEmployees.Add(couAssistant);
                        }

                        else
                        {
                            newEmployees.Add(couAss);
                        }
                    }
                    await db.SaveChangesAsync();

                    List<CourseAssistant> removeEmployee = existingEmployees.Except(newEmployees).ToList();
                    foreach (CourseAssistant notList in removeEmployee)
                    {
                        CourseAssistant deleteEmployeeItem = new CourseAssistant();
                        db.CourseAssistants.Remove(notList);
                        existingEmployees.Remove(notList);

                        Course c_ourse = await db.Courses.Where(x => x.CourseID == notList.CourseID).FirstOrDefaultAsync();
                    }
                    await db.SaveChangesAsync();

                    return new { Status = 200, Message = "Course updated" };
                }
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteCourse(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                
                //Check if course is attached to any sections

                var any = await db.Sections.Where(x => x.CourseID == id).CountAsync();
               
                if(any > 0)
                {
                    return new { Status = 400, Message = "Sections are attached to this course" };
                }

                else
                {
                    db.Configuration.ProxyCreationEnabled = false;

                    Course course = await db.Courses.FindAsync(id);

                    List<CourseAssistant> assistants = await db.CourseAssistants.Where(x => x.CourseID == id).ToListAsync();
                    foreach(CourseAssistant assistant in assistants)
                    {
                        db.CourseAssistants.Remove(assistant);
                        await db.SaveChangesAsync();
                    }

                    List<CoursePrice> prices = await db.CoursePrices.Where(x => x.CourseID == id).ToListAsync();
                    foreach (CoursePrice price in prices)
                    {
                        db.CoursePrices.Remove(price);
                        await db.SaveChangesAsync();
                    }

                    db.Courses.Remove(course);
                    await db.SaveChangesAsync();

                    return new { Status = 200, Message = "Course removed" };
                }

             
            }

            catch (Exception)
            {
                return new { Status = 501, Message = "FK Constraint" };
            }
        }

        public async Task<object> GetCourseID(int id)
        {
            try
            {
                return await db.Courses.Select(x => new 
                {
                   ID = x.CourseID,
                   Name = x.Name
                }).ToListAsync(); 
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetEmployeesForCourses()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
               
                var obj = await db.Employees.Select(x => new
                {
                    EmployeeID = x.EmployeeID,
                    Name = x.Name,
                    Surname = x.Surname,
                    Email = x.Email
                }).ToListAsync();
                
                return obj;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetCategory(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.CourseCategories.Where(x => x.CategoryID == id).FirstOrDefaultAsync();
                var category = obj.Category;
                return category;
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        public async Task<object> ViewStore(int studentID)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;



                var courses = await db.Courses
    .Join(db.CourseCategories,
        course => course.CategoryID,
        category => category.CategoryID,
        (course, category) => new { Course = course, Category = category })
    .GroupJoin(db.CoursePrices,
        courseCategory => courseCategory.Course.CourseID,
        prices => prices.CourseID,
        (courseCategory, prices) => new { Course = courseCategory.Course, Category = courseCategory.Category, Prices = prices })
    .SelectMany(
        courseGroup => courseGroup.Prices.OrderByDescending(price => price.Date).Take(1),
        (courseGroup, price) => new { Course = courseGroup.Course, Category = courseGroup.Category, Price = price })
    .Where(c => c.Course.Active == "True" &&
                !db.StudentCourses.Any(sc => sc.CourseID == c.Course.CourseID && sc.StudentID == studentID))
    .Select(c => new
    {
        CourseID = c.Course.CourseID,
        Name = c.Course.Name,
        Description = c.Course.Description,
        Image = c.Course.Image,
        CategoryID = c.Category.CategoryID,
        Preview = c.Course.Preview,
        Category = c.Category.Category,
        Price = c.Price.Price
    })
    .ToListAsync();

                return courses;




            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> ViewCourseStructure(int id)
        {
            try
            {
                var courseDetails = await db.Courses.Where(c => c.CourseID == id)
                    .Select(c => new { 
                        CourseID = c.CourseID,
                        CourseName = c.Name,
                        Sections = c.Sections
                    .Select(s => new {
                                 SectionID = s.SectionID,
                                 SectionName = s.SectionName,
                                 SectionDescription = s.SectionDescription,
                                 Lessons = s.Lessons
                    .Select(l => new {
                    LessonID = l.LessonID,
                    LessonName = l.LessonName,
                    LessonDescription = l.LessonDescription
                    })
                  }) 
                }).FirstOrDefaultAsync();

                return courseDetails;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetRatings(int id)
        {
            try
            {
                var ratings = await db.CourseRatings
                    .Join(db.Students,
                        rating => rating.StudentID,
                        student => student.StudentID,
                        (rating, student) => new { Rating = rating, Student = student })
                    .Where(r => r.Rating.CourseID == id)
                    .Select(r => new
                    {
                        RatingID = r.Rating.RatingID,
                        CourseID = r.Rating.CourseID,
                        Date = r.Rating.Date,
                        StudentID = r.Rating.StudentID,
                        Name = r.Student.Name,
                        Surname = r.Student.Surname,
                        Rating = r.Rating.Rating,
                        Comment = r.Rating.Comment
                    })
                    .ToListAsync();

                int numberOfRatings = ratings.Count;
                double averageRating = 0;

                if (numberOfRatings > 0)
                {
                    averageRating = ratings.Average(r => r.Rating);
                }

                return new { Ratings = ratings, NumberOfRatings = numberOfRatings, AverageRating = averageRating };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }

        }

        public async Task<object> GetPersonalRatings(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var ratings = await db.CourseRatings
                    .Where(cr => cr.StudentID == id)
                    .Join(db.Courses,
            cr => cr.CourseID,
            c => c.CourseID,
            (cr, c) => new
            {
               RatingID = cr.RatingID,
               Rating = cr.Rating,
               Date = cr.Date,
               Comment = cr.Comment,
               StudentID = cr.StudentID,
               Name = c.Name
            })
        .ToListAsync();

                return ratings;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> SendAnnouncement(Announcement announcement)
        {
            try
            {
                var studentEmails = await db.StudentCourses
                    .Where(sc => sc.CourseID == announcement.CourseID)
                    .Select(sc => sc.Student.Email)
                    .ToListAsync();

                if (studentEmails.Count == 0)
                {
                    return new { Status = 404, Message = "No students enrolled in this course" };
                }
                var course = await db.Courses.Where(x => x.CourseID == announcement.CourseID).FirstOrDefaultAsync();
                string name = course.Name;
                await SendCourseAnnouncement(studentEmails, announcement.Message, name);

                return new { Status = 200, Message = "Announcement sent" };
            }

            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        private async Task SendCourseAnnouncement(IEnumerable<string> emails, string messageBody, string name)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var subject = "Course Announcement:" + " " + name;
            var message = messageBody;

            using (var smtp = new SmtpClient("smtp.gmail.com", 587))
            {
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(fromEmailAccount, fromEmailAccountPassword);

                using (var compiledMessage = new MailMessage())
                {
                    compiledMessage.From = fromAddress;
                    compiledMessage.Subject = subject;
                    compiledMessage.Body = message;
                    compiledMessage.IsBodyHtml = true;

                    foreach (var email in emails)
                    {
                        compiledMessage.Bcc.Add(email);
                    }

                    await smtp.SendMailAsync(compiledMessage);
                }
            }
        }

        private async Task SendContact(dynamic body)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(fromEmailAccount);

            var subject = "New Contact Query";
            var message = "Name:" + " " + body.Name +
                    "<br> Email: " + " " + body.Email +
                    "<br><br> Message:" + " " + body.Query;
;

            using (var compiledMessage = new MailMessage(fromAddress, toAddress))
            {
                compiledMessage.Subject = subject;
                compiledMessage.Body = string.Format(message);
                compiledMessage.IsBodyHtml = true;


                using (var smtp = new SmtpClient())
                {
                    smtp.Host = "smtp.gmail.com"; // for example: smtp.gmail.com
                    smtp.Port = 587;
                    smtp.EnableSsl = true;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new NetworkCredential(fromEmailAccount, fromEmailAccountPassword); // your own provided email and password
                    await smtp.SendMailAsync(compiledMessage);
                }
            }
        }

        public async Task<object> SendContactQuery(dynamic body)
        {
            try
            {
                Contact contact = new Contact();
                contact.ContactID = 0;
                contact.Email = body.Email;
                contact.Name = body.Name;
                contact.Query = body.Query;

                db.Contacts.Add(contact);
                await db.SaveChangesAsync();

                await SendContact(body);

                return new { Status = 200, Message = "Contact sent" };
            }

            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public async Task<object> GetCourseView(int id)
        {
            
                try
                {
                    var courseDetails = await db.Courses.Where(c => c.CourseID == id)
                        .Select(c => new
                        {
                            CourseID = c.CourseID,
                            CourseName = c.Name,
                            Sections = c.Sections.Select(s => new
                            {
                                SectionID = s.SectionID,
                                SectionName = s.SectionName,
                                SectionDescription = s.SectionDescription,
                                Lessons = s.Lessons.Select(l => new
                                {
                                    LessonID = l.LessonID,
                                    LessonName = l.LessonName,
                                    LessonDescription = l.LessonDescription,
                                    VideoID =l.VideoID,
                                    LessonResources = l.LessonResources.Select(r => new
                                    {
                                        ResourceID = r.ResourceID,
                                        ResourceName = r.ResourceName,
                                        ResourceFile = r.ResourceFile
                                    })
                                })
                            })
                        })
                        .FirstOrDefaultAsync();

                    return courseDetails;
                }
                catch (Exception)
                {
                    return new { Status = 500, Message = "Internal server error, please try again" };
                }
            

        }

        public async Task<object> GetEnrolledCourses(int id)
        {
            try
            {
                

                var enrolledCourses = await db.StudentCourses
                    .Where(sc => sc.StudentID == id)
                    .Join(db.Courses,
                        sc => sc.CourseID,
                        c => c.CourseID,
                        (sc, c) => new
                        {
                            CourseID = c.CourseID,
                            Name = c.Name,
                            Image = c.Image,
                            Description = c.Description,
                            FirstLesson = c.Sections
                                .SelectMany(s => s.Lessons)
                                .OrderBy(l => l.LessonID)
                                .FirstOrDefault()
                        })
                    .Select(ec => new
                    {
                        ec.CourseID,
                        ec.Name,
                        ec.Image,
                        ec.Description,
                        LessonName = ec.FirstLesson.LessonName,
                        VideoID = ec.FirstLesson.VideoID
                    })
                    .ToListAsync();

                return enrolledCourses;

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}