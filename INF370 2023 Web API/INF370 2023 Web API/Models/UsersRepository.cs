using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data;
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
using System.Web.Http.ModelBinding;

namespace INF370_2023_Web_API.Models
{
    
    public class UsersRepository : IUsers
    {
       //Initialize db context

        private readonly Entities db;

        //Dependency injection

        public UsersRepository(Entities database)
        {
            this.db = database;
        }


        //////////////////////////////////////////////////////////////////////////////
        //                        User procedures                                   //
        ////////////////////////////////////////////////////////////////////////////// 


        // 1.1 Add Student
        public async Task<object> NewStudent([FromBody] StudentViewModel student)
        {
            try
            {

                if (await UserNameExists(student.Email))
                {
                    return new { Status = 401, Message = "User exists" };
                }

                if (await PhoneExists(student.Phone))
                {
                    return new { Status = 402, Message = "Phone in use" };
                }


                using (DbContextTransaction transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        User nUser = new User();
                        nUser.UserID = 0;
                        nUser.Username = student.Email;

                        // Password
                        string pass = student.Password;
                        var hash = GenerateHash(ApplySomeSalt(pass));

                        nUser.Password = hash;
                        nUser.GUID = null;
                        nUser.Activity = "True";
                        nUser.OTP = null;
                        nUser.UserRoleID = 3;
                        nUser.OTPExpiry = null;

                        db.Users.Add(nUser);
                        await db.SaveChangesAsync();

                        // Student details to post

                        Student stud = new Student();
                        User newuserid = db.Users.Where(x => x.Username == student.Email).FirstOrDefault();

                        stud.StudentID = 0;
                        stud.TitleID = student.TitleID;
                        stud.Name = student.Name;
                        stud.Surname = student.Surname;
                        stud.Email = student.Email;
                        stud.Phone = student.Phone;
                        stud.Deleted = "False";
                        stud.UserID = newuserid.UserID;

                        db.Students.Add(stud);
                        await db.SaveChangesAsync();

                        //Commit

                        transaction.Commit();


                    }

                    catch (Exception)
                    {
                        // Rollback if one or more items doesn't store
                        transaction.Rollback();
                        dynamic ErrorResponse = new ExpandoObject();
                        ErrorResponse.Status = 500;
                        ErrorResponse.Error = "An error has occurred, please ensure the required data is properly serialized";
                        return ErrorResponse;
                    }
                }



                return new { Status = 200, Message = "Student successfully added" };
            }

            catch (Exception)
            {
                dynamic ErrorResponse = new ExpandoObject();
                ErrorResponse.Status = 500;
                ErrorResponse.Error = "Internal Server error, please try again";
                return ErrorResponse;
            }
        }

        //Employees


        // 2.1 Add Employee
        public async Task<object> NewEmployee([FromBody] EmployeeViewModel employee)
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
                toAddUser.Password = ("DarusSalaam" + random.Next(5000, 10001));
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
                            empQualifications.EmployeeQualificationID = 0;
                            empQualifications.EmployeeID = empID;
                            empQualifications.QualificationID = item;
                            db.EmployeeQualifications.Add(empQualifications);
                            await db.SaveChangesAsync();

                        }

                        // Skills

                        EmployeeSkill empSkills = new EmployeeSkill();
                        foreach (int item in employee.Skills)
                        {
                            empSkills.EmployeeSkillID = 0;
                            empSkills.EmployeeID = empID;
                            empSkills.SkillID = item;
                            db.EmployeeSkills.Add(empSkills);
                            await db.SaveChangesAsync();

                        }

                        //Finalize transaction
                        transaction.Commit();

                    }

                    catch (Exception)
                    {
                        //Rollback user and employee details if anything goes wrong
                        transaction.Rollback();
                        dynamic ErrorResponse = new ExpandoObject();
                        ErrorResponse.Status = 500;
                        ErrorResponse.Error = "An error has occurred, please ensure the required data is in properly serialized";
                        return ErrorResponse;
                    }
                }

                //send account details
                string name = employee.Employee.Name;
                string surname = employee.Employee.Surname;
                string pass = toAddUser.Password;
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

        // Send Account Details Email

        private async Task SendAccountDetailsEmail(string emailID, string name, string surname, string password)
        {
            var fromEmailAccount = "muhammad.ayob7@gmail.com";
            var fromEmailAccountPassword = "wkguzejivsgpirle";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Employee Account";
            var message = "Dear" + " " + name + " " + surname
                + "<br> We are delighted to welcome you to the team!"
                + "<br> Please use the following user credentials to access your user profile, and feel free to change it accordingly under the 'My Account' tab located within the 'settings' icon dropdown on the top right corner -"
                + "<br>Email/Username:" + emailID
                + "<br>Password:" + password
                + "<br>For further assistance or enquiries, please contact us at" + "" + fromAddress;



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

        private async Task SendOTPEmail(string emailID, string name, string surname, int OTP, dynamic OTPExpiry)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "OTP";
            var message = "Dear, " + name + " " + surname + "<br/><br/>We have received a request to reset your account password. " +
                    "<br> Please enter the OTP provided below in order to reset your password." +
                    "<br> <h2>OTP: " + OTP + "</h2>" +
                    "<br> Please note that the OTP will expire at: " + OTPExpiry+""+", and please ensure that you enter the OTP before the expiration date and time, otherwise you will have to request a new OTP. " +
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

        //////////////////////////////////////////////////////////////////////////////
        //                        Extension procedures for validation checks        //
        ////////////////////////////////////////////////////////////////////////////// 

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

        private async Task<bool> StudentPhoneExists(string phone)
        {
            return await db.Students.CountAsync(x => x.Phone == phone) > 0;
        }

        //////////////////////////////////////////////////////////////////////////////
        //                        Hashing procedures                                //
        ////////////////////////////////////////////////////////////////////////////// 

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

        //////////////////////////////////////////////////////////////////////////////
        //                        Other user components                             //
        //////////////////////////////////////////////////////////////////////////////

        

        public async Task<object> Login([FromBody] User User)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;

                if (User != null)
                {
                    string pass = User.Password;
                    var hash = GenerateHash(ApplySomeSalt(pass));

                    User user = await db.Users.Where(x => x.Username == User.Username && x.Password == hash).FirstOrDefaultAsync();


                    if (user != null)
                    {
                        if (user.Activity == "True")
                        {
                            return await refreshUserGuid(user);
                        }

                        else if (user.Activity == "False")
                        {
                            dynamic error = new ExpandoObject();
                            error.Status = 405;
                            error.Message = "Your account is disabled";
                            return error;
                        }
                    }

                    dynamic Error = new ExpandoObject();
                    Error.Status = 404;
                    Error.Message = "Email or password is incorrect";
                    return Error;
                }

                else
                {
                    dynamic toReturn = new ExpandoObject();
                    toReturn.Message = "Please try again";
                    return toReturn;
                }
            }
            catch (Exception)
            {
                dynamic error = new ExpandoObject();
                error.Status = 500;
                error.Message = "Internal server error, please try again.";
                return error;
            }
        }

       
        public async Task<object> Logout(string token)
        {
            using (DbContextTransaction transaction = db.Database.BeginTransaction())
            {
                try
                {
                    User user = await db.Users.Where(x => x.GUID == token).FirstOrDefaultAsync();
                    if (user != null)
                    {
                        user.GUID = null;
                        await db.SaveChangesAsync();
                        transaction.Commit();

                        dynamic toReturn = new ExpandoObject();
                        toReturn.Status = 200;
                        toReturn.Message = "Successfully logged out!";
                        return toReturn;
                    }

                    else
                    {
                        dynamic toReturn = new ExpandoObject();
                        toReturn.Status = 404;
                        toReturn.Message = "You are already logged out!";
                        return toReturn;
                    }
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    dynamic toReturn = new ExpandoObject();
                    toReturn.Status = 500;
                    toReturn.Message = "Internal server error, please try again!";
                    return toReturn;
                }
            }
        }

        //Refreshing guid for login

        public async Task<User> refreshUserGuid(User user)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                User User = await db.Users.Where(x => x.UserID == user.UserID).FirstOrDefaultAsync();

                if (User.GUID == null)
                {
                    User.GUID = Guid.NewGuid().ToString();
                }
                await db.SaveChangesAsync();
                db.Configuration.ProxyCreationEnabled = false;
                return (User);
            }

            catch (Exception)
            {
                dynamic Error = new ExpandoObject();
                Error.Status = 500;
                Error.Message = "Internal server error, please try again";
                return Error;
            }
        }

        public async Task<object> validateUser(string token)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                if (token.Length > 4)
                {
                    User user = await db.Users.Where(x => x.GUID == token).FirstOrDefaultAsync();
                    if (user != null)
                    {
                        return user;
                    }
                    else
                    {
                        dynamic Error = new ExpandoObject();
                        Error.Status = 404;
                        Error.Message = ("Your session has expired. Please Log in again");
                        return Error;
                    }
                }
                else
                {
                    dynamic Error = new ExpandoObject();
                    Error.Status = 404;
                    Error.Message = ("Please login first.");
                    return Error;
                }
            }
            catch (Exception)
            {
                dynamic Error = new ExpandoObject();
                Error.Status = 500;
                Error.Message = "Internal server error, please try again";
                return Error; 
            }
        }

        public async Task<object> ReactivateUser(int id)
        {
            try 
            {
                db.Configuration.ProxyCreationEnabled = false;
                var user = await db.Users.Where(i => i.UserID == id).FirstOrDefaultAsync();

                if(user.UserRoleID == 3)
                {
                    Student student = await db.Students.Where(s => s.UserID == user.UserID).FirstOrDefaultAsync();
                    student.Deleted = "False";
                    db.Entry(student).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                }

                else
                {
                    Employee employee = await db.Employees.Where(e => e.UserID == user.UserID).FirstOrDefaultAsync();
                    employee.Deleted = "False";
                    db.Entry(employee).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                }

                user.Activity = "True";
                db.Entry(user).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new {Status=200, Message="User successfully reactivated." };
            }
            catch (Exception)
            {
                dynamic Error = new ExpandoObject();
                Error.Status = 404;
                Error.Message = "Internal server error, please try again";
                return Error;
            }
        }

        public async Task<object> DeactivateUser(int id)
        {
            using (DbContextTransaction transaction = db.Database.BeginTransaction())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    User user = await db.Users.Where(x => x.UserID == id).FirstOrDefaultAsync();

                    if (user != null)
                    {


                        if (user.UserRoleID == 1 || user.UserRoleID == 2)
                        {
                            if (user.UserRoleID == 1)
                            {
                                var admin = await db.Users.CountAsync(x => x.UserRoleID == 1);
                                if (admin < 2)
                                {
                                    dynamic error = new ExpandoObject();
                                    error.status = 404;
                                    error.message = "This is the last activated administrator, please have ensure that there are a minimum of at least 2 administrators active on the system.";
                                    return error;
                                }

                                else
                                {
                                    user.Activity = "False";
                                    db.Entry(user).State = EntityState.Modified;
                                    await db.SaveChangesAsync();

                                    Employee employee = await db.Employees.Where(x => x.UserID == id).FirstOrDefaultAsync();
                                    employee.Deleted = "True";
                                    db.Entry(employee).State = EntityState.Modified;
                                    await db.SaveChangesAsync();

                                }
                            }

                            else if (user.UserRoleID == 2)
                            {
                                user.Activity = "False";
                                db.Entry(user).State = EntityState.Modified;
                                await db.SaveChangesAsync();

                                Employee employee = await db.Employees.Where(x => x.UserID == id).FirstOrDefaultAsync();
                                employee.Deleted = "True";
                                db.Entry(employee).State = EntityState.Modified;
                                await db.SaveChangesAsync();

                            }


                        }

                        else
                        {
                            user.Activity = "False";
                            db.Entry(user).State = EntityState.Modified;
                            await db.SaveChangesAsync();

                            Student student = await db.Students.Where(x => x.UserID == id).FirstOrDefaultAsync();
                            student.Deleted = "True";
                            db.Entry(student).State = EntityState.Modified;
                            await db.SaveChangesAsync();
                        }

                        transaction.Commit();

                        dynamic toReturn = new ExpandoObject();
                        toReturn.Status = 200;
                        toReturn.Message = "User deactivation successful";
                        return toReturn;


                    }

                    else
                    {
                        transaction.Rollback();
                        dynamic toReturn = new ExpandoObject();
                        toReturn.Status = 404;
                        toReturn.Message = "User doesn't exist";
                        return toReturn;
                    }
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    dynamic toReturn = new ExpandoObject();
                    toReturn.Status = 500;
                    toReturn.Message = "Internal server error, please try again.";
                    return toReturn;
                }


            }
        }

        public async Task<object> PostAuditLog(AuditLog audit)
        {
            DbContextTransaction transaction = db.Database.BeginTransaction();

            try 
            {
                audit.Date = DateTime.Now;
                db.AuditLogs.Add(audit);
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "AuditLogPosted" };
            }
            catch (Exception)
            {
                transaction.Rollback();
                return new { Status = 500, Message = "Internal server error, please try again." };
            }
        }

        public async Task<object> getUserName(int id)
        {
            try 
            {
                Employee employeeDetails = new Employee();

                Student studentDetails = new Student();

                User user = await db.Users.Where(x => x.UserID == id).FirstOrDefaultAsync();

                if (user.UserRoleID == 3)
                {
                    Student student = await db.Students.Where(s => s.UserID == user.UserID).FirstOrDefaultAsync();
                    
                    // retrieve title id
                    var tID = student.TitleID;
                   
                    // retrieve title name
                    var tName = await db.Titles.Where(x => x.TitleID == tID).FirstOrDefaultAsync();

                    studentDetails.UserID = id;
                    studentDetails.StudentID = student.StudentID;
                   // studentDetails.Title.TitleName = tName.TitleName;
                    studentDetails.Name = student.Name;

                    return studentDetails;
                }

                else
                {
                    Employee employee = await db.Employees.Where(x => x.UserID == user.UserID).FirstOrDefaultAsync();

                    // retrieve title id
                    var tID = employee.TitleID;

                    // retrieve title name
                    var tName = await db.Titles.Where(x => x.TitleID == tID).FirstOrDefaultAsync();

                    employeeDetails.UserID = id;
                    employeeDetails.EmployeeID = employee.EmployeeID;
                   // employeeDetails.Title.TitleName = tName.TitleName;
                    employeeDetails.Name = employee.Name;

                    return employeeDetails;
                }
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 404;
                toReturn.Message = "User doesn't exist";
                return toReturn;
            }
        }

        public async Task<object> UpdateEmployeeProfile(int id, Employee employee)
        {
            try
            {
               
                // Check if email in use
                var EmpEmail = await db.Users.Where(x => x.Username == employee.Email && x.UserID != employee.UserID).FirstOrDefaultAsync();

                //Check if ID is in use
                var x_Employee = await db.Employees.Where(x => x.RSAIDNumber == employee.RSAIDNumber && x.EmployeeID != employee.EmployeeID).FirstOrDefaultAsync();

                //Check if Phone in use
                bool xPhoneInUse = await db.Employees.CountAsync(x => x.Phone == employee.Phone && x.EmployeeID != employee.EmployeeID ) > 0 || await db.Students.CountAsync(x => x.Phone == employee.Phone) > 0;

                if (EmpEmail != null)
                {
                    return new { Status = 404, Message = "Email in use" };
                }

                if(x_Employee != null)
                {
                    return new { Status = 405, Message = "ID number in use" };
                }

                if (xPhoneInUse)
                {
                    return new { Status = 406, Message = "Phone number in use" };
                }

                User user = await db.Users.Where(x => x.UserID == employee.UserID).FirstOrDefaultAsync();

                user.Username = employee.Email;
                db.Entry(user).State = EntityState.Modified;
                await db.SaveChangesAsync();

                db.Entry(employee).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Profile updated successfully" };


            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        public async Task<object> UpdateStudentProfile(int id, Student student)
        {
            try
            {
                // Check if email in use
                var StudEmail = await db.Users.Where(x => x.Username == student.Email && x.UserID != student.UserID).FirstOrDefaultAsync();

                //Check if Phone in use
                bool xPhoneInUse = await db.Employees.CountAsync(x => x.Phone == student.Phone) > 0 || await db.Students.CountAsync(x => x.Phone == student.Phone && x.StudentID != student.StudentID) > 0;

                if (StudEmail != null)
                {
                    return new { Status = 404, Message = "Email in use" };
                }

                if (xPhoneInUse)
                {
                    return new { Status = 405, Message = "Phone number in use" };
                }

                User user = await db.Users.Where(x => x.UserID == student.UserID).FirstOrDefaultAsync();
                user.Username = student.Email;
                db.Entry(user).State = EntityState.Modified;
                await db.SaveChangesAsync();

                db.Entry(student).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Student updated successfully" };
            }

            catch (Exception e)
            {
                return e.ToString();
            }
        }

        public async Task<object> GetUsers()
        {

            try 
            {
                
                return await db.Users
                    .Include(s => s.UserRole)
                    .Where(s => s.UserRoleID == s.UserRole.UserRoleID)
                    .Where(u => u.Activity == "False")
                    .ToListAsync();
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 404;
                toReturn.Message = "Internal server error, please try again";
                return toReturn;
            }
        }

        public async Task<object> ForgotPassword([FromBody] User user)
        {
            using (DbContextTransaction transaction = db.Database.BeginTransaction())
            {

                dynamic obj = new ExpandoObject();

                using (Entities dc = new Entities())
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    var account = await dc.Users.Where(a => a.Username == user.Username).FirstOrDefaultAsync();
                    var name = "";
                    var surname = "";
                    if (account != null)
                    {
                        //Check which user to retrieve name and surname

                        if (account.UserRoleID == 3)
                        {
                            var student = await dc.Students.Where(c => c.UserID == account.UserID).FirstOrDefaultAsync();
                            name = student.Name;
                            surname = student.Surname;
                        }
                        else
                        {
                            var employee = await dc.Employees.Where(e => e.UserID == account.UserID).FirstOrDefaultAsync();
                            name = employee.Name;
                            surname = employee.Surname;
                        }


                        //Generate random 6 digit OTP

                        var OTP = new Random().Next(100000, 1000000);
                       
                        var minutes = await db.OTPTimers.FirstOrDefaultAsync();
                        
                        var OTPExpiry = DateTime.Now.AddMinutes(minutes.MinutesUntilExpiry);
                        // send email with otp for password reset

                        await SendOTPEmail(account.Username,name,surname,OTP,OTPExpiry);
                        account.OTP = OTP;
                        account.OTPExpiry = OTPExpiry;

                        dc.Configuration.ValidateOnSaveEnabled = false;
                        await dc.SaveChangesAsync();

                        transaction.Commit();
                        return new { Status = 200, Message = "Reset password OTP" };
                       
                    }
                    else
                    {
                        transaction.Rollback();
                        return new { Status = 404, Message = "Account not found" };
                    }
                }

                //return obj;
            }
        }

        public async Task<object> NewPassword([FromBody] User usr)
        {
            using (DbContextTransaction transaction = db.Database.BeginTransaction())
            {
                

                try
                {
                    using (Entities dc = new Entities())
                    {
                        db.Configuration.ProxyCreationEnabled = false;

                        

                        var user = await dc.Users.Where(a => a.OTP == usr.OTP).FirstOrDefaultAsync();
                        if (user != null)
                        {
                            if(DateTime.Now >= user.OTPExpiry)
                            {
                                user.OTP = null;
                                user.OTPExpiry = null;

                                dc.Configuration.ValidateOnSaveEnabled = false;
                                await dc.SaveChangesAsync();
                                transaction.Commit();
                                
                                return new { Status = 300, Message = "OTPExpiry surpassed, please request new OTP" };
                            }

                            else
                            {
                                string pass = usr.Password;
                                var hash = GenerateHash(ApplySomeSalt(pass));
                                if (hash == user.Password)
                                {
                                    transaction.Rollback();
                                    return new { Status = 700, Message = "Password cannot be the same as old password" };
                                }
                                user.Password = hash;
                                user.OTP = null;
                                user.OTPExpiry = null;
                                dc.Configuration.ValidateOnSaveEnabled = false;
                                dc.SaveChanges();

                                transaction.Commit();
                                
                                return new { Status = 200, Message = "Password reset successfully" };
                            }
                            
                        }
                       
                        else
                        {
                            transaction.Rollback();

                            return new { Status = 500, Message = "You do not have permission to change your password" };
                        }
                    }
                }
                catch (Exception e)
                {
                    transaction.Rollback();

                    return e.ToString();
                }

                
            }
        }

        public async Task<object> GetDisabledUsers()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.Users
                    .Include(s => s.UserRole)
                    .Where(s => s.UserRoleID == s.UserRole.UserRoleID)
                    .Where(u => u.Activity == "False")
                    .ToListAsync();
                return obj;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}