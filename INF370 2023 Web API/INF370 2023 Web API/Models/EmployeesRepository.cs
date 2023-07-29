using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class EmployeesRepository : IEmployees
    {
        //Dependency injection

        private readonly Entities db;

        public EmployeesRepository(Entities database)
        {
            this.db = database;
        }

        public static string ApplySomeSalt(string input)
        {
            try
            {
                return input + "hijsbdlhishvhisabhbhahvbchlsbv";
            }
            catch
            {
                return null;
            }
        }

        public static string GenerateHash(string Inputstring)
        {
            try
            {
                SHA256 sha256 = SHA256Managed.Create();
                byte[] bytes = Encoding.UTF8.GetBytes(Inputstring);
                byte[] hash = sha256.ComputeHash(bytes);
                return GetStringFromHash(hash);
            }
            catch
            {
                return null;
            }
        }

        private static string GetStringFromHash(byte[] hash)
        {
            try
            {
                StringBuilder result = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    result.Append(hash[i].ToString("X2"));
                }
                return result.ToString();
            }
            catch
            {
                return null;
            }
        }

        private async Task<bool> UserNameExists(string name)
        {
            var exists = await db.Users.Where(p => p.Username == name).FirstOrDefaultAsync();
            return exists != null;
        }

        private async Task<bool> EmployeeExists(string id)
        {
            return await db.Employees.CountAsync(e => e.RSAIDNumber == id) > 0;
        }

        private async Task<bool> PhoneExists(string phone)
        {
            return await db.Employees.CountAsync(x => x.Phone == phone) > 0 || await db.Students.CountAsync(x => x.Phone == phone) > 0;
        }

        private async Task SendAccountDetailsEmail(string emailID, string name, string surname, string password)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Employee Account";
            var message = "Dear" + " " + name + " " + surname
                + "<br> We are delighted to welcome you to the team!"
                +"<br>"
                + "<br> Please use the following user credentials to access your user profile, and feel free to change it accordingly under the 'My Account' tab located within the 'settings' icon dropdown on the top right corner -"
                + "<br>Email/Username:" + " " + emailID
                + "<br>Password:" + " " + password
                + "<br>" +
                "<br/> If you require any further assistance please contact us at dseiqueries@gmail.com" +
                "<br/> Sincerely, The Onyx Team" +
                "<br/><h5>Powered by Onyx</h5>";



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


        public async Task<object> DeleteEmployee(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var employee = await db.Employees.Where(x => x.EmployeeID == id).FirstOrDefaultAsync();

                var check = await db.CourseAssistants.Where(x => x.EmployeeID == employee.EmployeeID).FirstOrDefaultAsync();
                if (check != null)
                {
                    return new { Status = 900, Message = "Remove from course/s" };
                }
               
                //Get employee user id
               // var eUserID = employee.UserID;
                
                //Find employee in user table
                var find = await db.Users.Where(x=>x.UserID==employee.UserID).FirstOrDefaultAsync();

                //Get User Role
               // var uRoleID = find.UserRoleID;
                var activeAdmins = await db.Users.CountAsync(x => x.UserRoleID == 1 && x.Activity == "True");
               
                

                if(activeAdmins < 2 && find.UserRoleID == 1)
                {
                    dynamic error = new ExpandoObject();
                    error.Status = 404;
                    error.Message = "This is the last activated administrator, please have ensure that there are a minimum of at least 2 administrators active on the system.";
                    return error;
                }

                else
                {
                    employee.Deleted = "True";
                    db.Entry(employee).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    User user = await db.Users.Where(s => s.UserID == employee.UserID).FirstOrDefaultAsync();
                    user.Activity = "False";
                    db.Entry(user).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                    dynamic obj = new ExpandoObject();
                    obj.Status = 200;
                    await SendEmailDeactivated(employee.Email);
                    return new {Status=200, Count=activeAdmins,ID=find.UserRoleID};

                }

               
            }

            catch(Exception e)
            {
                // dynamic toReturn = new ExpandoObject();
                ////  toReturn.Status = 500;
                //  toReturn.Message = "Internal server error, please try again";
                // return toReturn;
                return e.ToString();
            }
        }

        private async Task SendEmailDeactivated(string emailID)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "De-activation of account";
            var message = "Dear Employee,"
                + "<br> This email serves to inform you of the de-activation of your user account. You will no longer be able to Login to your account unless you have been re-activated."
                + "<br>"
                + "<br> If you would like to reverse the de-activation, please contact us at dseiqueries@gmail.com" +
                "<br> <br> Sincerely, The Onyx Team" +
                "<br/><h5>Powered by Onyx</h5>";



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

        public async Task<object> GetEmployeeDetails(int id)
        {
            try 
            {
                
                dynamic empDetails = new ExpandoObject();

                db.Configuration.ProxyCreationEnabled = false;
                var empDetail = await db.Employees
                    .Where(p => p.EmployeeID == id)
                    .Include(p => p.Department)
                    .Include(p => p.User)
                    .Select(p => new
                    {
                        EmployeeID = p.EmployeeID,
                        UserID = p.UserID,
                        UserRoleID = p.User.UserRoleID,
                        Name = p.Name,
                        Surname = p.Surname,
                        Phone = p.Phone,
                        RSAIDNumber = p.RSAIDNumber,
                        Email = p.Email,
                        DepartmentID = p.Department.DepartmentID,
                        Deleted = p.Deleted,
                        Image = p.Image,
                        TitleID = p.TitleID,
                        Biography = p.Biography
                    }).FirstOrDefaultAsync();

                empDetails.Employee = empDetail;

                db.Configuration.ProxyCreationEnabled = false;
                List<EmployeeSkill> empSkills = await db.EmployeeSkills.ToListAsync();
                List<int> skillID = new List<int>();
                int s = 0;
                foreach(EmployeeSkill skill in empSkills)
                {
                    if(skill.EmployeeID == id)
                    {
                        s = skill.SkillID;
                        skillID.Add(s);
                    }
                }

                empDetails.Skills = skillID;
                db.Configuration.ProxyCreationEnabled = false;
                List<EmployeeQualification> empQuali = await db.EmployeeQualifications.ToListAsync();
                List<int> qualiID = new List<int>();
                int q = 0;
                foreach(EmployeeQualification quali in empQuali)
                {
                    if (quali.EmployeeID == id)
                    {
                        q = quali.QualificationID;
                        qualiID.Add(q);
                    }
                }

                empDetails.Qualifications = qualiID;
                return empDetails;
              
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 500;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<object> GetEmployeeName(int id)
        {
            try 
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Employees.FindAsync(id);
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

        public async Task<object> GetEmployeeQualifications(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                List<dynamic> listEmployeeQualifications = new List<dynamic>();
                List<EmployeeQualification> qualifications = await db.EmployeeQualifications.Where(s => s.EmployeeID == id).ToListAsync();

                foreach (EmployeeQualification qualification in qualifications)
                {
                    dynamic obj = new ExpandoObject();
                    Qualification EmployeeQualification = await db.Qualifications.Where(s => s.QualificationID == qualification.QualificationID).FirstOrDefaultAsync();
                    obj.QualificationID = EmployeeQualification.QualificationID;
                    obj.QualificationName = EmployeeQualification.QualificationName;
                    obj.QualificationDescription = EmployeeQualification.Description; ;

                    listEmployeeQualifications.Add(obj);
                }
                return listEmployeeQualifications;
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

        public async Task<object> GetEmployees()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Employees.Where(x => x.Deleted == "False").ToListAsync();
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

        public async Task<object> GetEmployeeSkills(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                List<dynamic> listEmployeeSkills = new List<dynamic>();
                List<EmployeeSkill> skills = await db.EmployeeSkills.Where(s => s.EmployeeID == id).ToListAsync();

                foreach (EmployeeSkill skill in skills)
                {
                    dynamic obj = new ExpandoObject();
                    Skill EmployeeSkill = db.Skills.Where(s => s.SkillID == skill.SkillID).FirstOrDefault();
                    obj.SkillID = EmployeeSkill.SkillID;
                    obj.SkillName = EmployeeSkill.SkillName;
                    obj.SkillDescription = EmployeeSkill.Description;
                    SkillType skillType = await db.SkillTypes.Where(s => s.SkillTypeID == EmployeeSkill.SkillTypeID).FirstOrDefaultAsync();
                    obj.SkillTypeName = skillType.SkillTypeName;

                    listEmployeeSkills.Add(obj);
                }
                return listEmployeeSkills;
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

        public async Task<object> UpdateEmployee(int id, EmployeeViewModel employee)
        {
            try 
            {
                var _id = await db.Employees.Where(x => x.RSAIDNumber == employee.Employee.RSAIDNumber && x.EmployeeID != id).FirstOrDefaultAsync();
                bool _phone =  await db.Employees.CountAsync(x => x.Phone == employee.Employee.Phone && x.EmployeeID!=id) > 0 || await db.Students.CountAsync(x => x.Phone == employee.Employee.Phone) > 0;
                var _email = await db.Users.Where(x => x.Username == employee.Employee.Email && x.UserID != employee.Employee.UserID).FirstOrDefaultAsync();

                if (_id != null)
                {
                    return new
                    {
                        Status = 401,
                        Message = "ID in use"
                    };
                }

                if (_phone)
                {
                    return new
                    {
                        Status = 402,
                        Message = "Phone in use"
                    };
                }

                if (_email != null)
                {
                    return new
                    {
                        Status = 403,
                        Message = "Email in use"
                    };
                }

                Employee emp = await db.Employees.FindAsync(id);
                emp.DepartmentID = employee.Employee.DepartmentID;
                emp.Name = employee.Employee.Name;
                emp.Surname = employee.Employee.Surname;
                emp.TitleID = employee.Employee.TitleID;
                emp.Email = employee.Employee.Email;
                emp.RSAIDNumber = employee.Employee.RSAIDNumber;
                emp.Phone = employee.Employee.Phone;
                emp.Biography = employee.Employee.Biography;
                emp.Image = employee.Employee.Image;

                db.Entry(emp).State = EntityState.Modified;
                await db.SaveChangesAsync();

                User user = await db.Users.FindAsync(emp.UserID);
                user.Username = employee.Employee.Email;
                user.UserRoleID = employee.Employee.UserRoleID;
                db.Entry(user).State = EntityState.Modified;
                await db.SaveChangesAsync();

                EmployeeQualification addQualifications = new EmployeeQualification();
                EmployeeQualification deletQualificationItem = new EmployeeQualification();
                List<EmployeeQualification> existingeQualifications = await db.EmployeeQualifications.Where(s => s.EmployeeID == id).ToListAsync();
                List<EmployeeQualification> newQualifications = new List<EmployeeQualification>();

                foreach (int item in employee.Qualifications)
                {
                    EmployeeQualification quali = await db.EmployeeQualifications.Where(s => s.QualificationID == item && s.EmployeeID == emp.EmployeeID).FirstOrDefaultAsync();
                    if (quali == null)
                    {
                        addQualifications.EmployeeID = emp.EmployeeID;
                        addQualifications.QualificationID = item;
                        db.EmployeeQualifications.Add(addQualifications);
                        newQualifications.Add(addQualifications);
                    }
                    else
                    {
                        newQualifications.Add(quali);
                    }
                }

                await db.SaveChangesAsync();

                List<EmployeeQualification> removeQualification = existingeQualifications.Except(newQualifications).ToList();
                foreach (EmployeeQualification notList in removeQualification)
                {
                    db.EmployeeQualifications.Remove(notList);
                    existingeQualifications.Remove(notList);
                }
                await db.SaveChangesAsync();

                EmployeeSkill addSkills = new EmployeeSkill();
                EmployeeSkill deletSkillItem = new EmployeeSkill();
                List<EmployeeSkill> existingSkills = db.EmployeeSkills.Where(s => s.EmployeeID == id).ToList();
                List<EmployeeSkill> newSkills = new List<EmployeeSkill>();

                foreach (int item in employee.Skills)
                {
                    EmployeeSkill skill = db.EmployeeSkills.Where(s => s.SkillID == item && s.EmployeeID == emp.EmployeeID).FirstOrDefault();
                    if (skill == null)
                    {
                        addSkills.EmployeeID = emp.EmployeeID;
                        addSkills.SkillID = item;
                        db.EmployeeSkills.Add(addSkills);
                        newSkills.Add(addSkills);
                    }
                    else
                    {
                        newSkills.Add(skill);
                    }
                }
                await db.SaveChangesAsync();

                List<EmployeeSkill> removeSkill = existingSkills.Except(newSkills).ToList();
                foreach (EmployeeSkill notList in removeSkill)
                {
                    db.EmployeeSkills.Remove(notList);
                }
                await db.SaveChangesAsync();
               
                
                return new 
                { 
                    Status = 200, 
                    Message = "Employee Successfully updated" 
                };
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        public async Task<object> AddEmployee([FromBody] EmployeeViewModel employee)
        {
            try
            {
                // Check if client-side data is valid



                // Check if ID is unique

                if (await EmployeeExists(employee.Employee.RSAIDNumber))
                {
                    return new { Status = 401, Message = "ID exists" };
                }

                // Unique phone number present

                if (await PhoneExists(employee.Employee.Phone))
                {
                    return new { Status = 402, Message = "Phone number in use" };
                }

                if (await UserNameExists(employee.Employee.Email))
                {
                    return new { Status = 403, Message = "User exists" };
                }

                // Post User Details
               

                User toAddUser = new User();
                toAddUser.UserID = 0;
                toAddUser.Username = employee.Employee.Email;
                Random random = new Random();
                string _pass = ("DarusSalaam" + random.Next(5000, 10001));
                toAddUser.Password = GenerateHash(ApplySomeSalt(_pass));
                toAddUser.GUID = null;
                toAddUser.Activity = "True";
                toAddUser.OTP = null;
                toAddUser.UserRoleID = employee.Employee.UserRoleID;
                toAddUser.OTPExpiry = null;

                //Post User
                using (DbContextTransaction transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        db.Users.Add(toAddUser);
                        await db.SaveChangesAsync();

                        /// Employee Details to Post

                        Employee emp = new Employee();
                        User newuserid = db.Users.Where(x => x.Username == employee.Employee.Email).FirstOrDefault();

                        emp.EmployeeID = 0;
                        emp.UserID = newuserid.UserID;
                        emp.Image = employee.Employee.Image;
                        emp.Name = employee.Employee.Name;
                        emp.Surname = employee.Employee.Surname;
                        emp.Email = employee.Employee.Email;
                        emp.Phone = employee.Employee.Phone;
                        emp.Biography = employee.Employee.Biography;
                        emp.RSAIDNumber = employee.Employee.RSAIDNumber;
                        emp.TitleID = employee.Employee.TitleID;
                        emp.Deleted = "False";
                        emp.DepartmentID = employee.Employee.DepartmentID;

                        //Add employee
                        db.Employees.Add(emp);
                        await db.SaveChangesAsync();


                        // Qualifications

                        Employee newEmpID = db.Employees.Where(x => x.RSAIDNumber == employee.Employee.RSAIDNumber).FirstOrDefault();
                        int empID = newEmpID.EmployeeID;


                        EmployeeQualification empQualifications = new EmployeeQualification();
                        foreach (int item in employee.Qualifications)
                        {
                           // empQualifications.EmployeeQualificationID = 0;
                            empQualifications.EmployeeID = empID;
                            empQualifications.QualificationID = item;
                            db.EmployeeQualifications.Add(empQualifications);
                            await db.SaveChangesAsync();

                        }

                        // Skills

                        EmployeeSkill empSkills = new EmployeeSkill();
                        foreach (int item in employee.Skills)
                        {
                           // empSkills.EmployeeSkillID = 0;
                            empSkills.EmployeeID = empID;
                            empSkills.SkillID = item;
                            db.EmployeeSkills.Add(empSkills);
                            await db.SaveChangesAsync();

                        }

                        //Finalize transaction
                        transaction.Commit();

                    }

                    catch (Exception e)
                    {
                        //Rollback user and employee details if anything goes wrong
                        transaction.Rollback();
                        dynamic ErrorResponse = new ExpandoObject();
                        ErrorResponse.Status = 500;
                        ErrorResponse.Error = "An error has occurred, please ensure the required data is in properly serialized";
                        return e.ToString();
                    }
                }

                //send account details
                string name = employee.Employee.Name;
                string surname = employee.Employee.Surname;
                string pass = _pass;
                string email = toAddUser.Username;

                await SendAccountDetailsEmail(email, name, surname, pass);

                return new { Status = 200, Message = "Employee Successfully added" };

            }

            catch (Exception e)
            {
                // dynamic ErrorResponse = new ExpandoObject();
                // ErrorResponse.Status = 500;
                // ErrorResponse.Error = "Internal Server error, please try again";
                // return ErrorResponse;
                return e.ToString();
            }
        }

        public async Task<object> GetEmployeeID(int id)
        {
            try
            {
                User user = await db.Users.FindAsync(id);
                Employee employee = await db.Employees.Where(x => x.UserID == user.UserID).FirstOrDefaultAsync();
                if (employee == null)
                {
                    return new { Status = 404, Message = "Internal server error" };
                }

                int ID = employee.EmployeeID;
                return ID;
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }
    }
}