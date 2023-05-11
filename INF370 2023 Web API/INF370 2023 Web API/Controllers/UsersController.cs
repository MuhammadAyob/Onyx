using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using INF370_2023_Web_API.Models;
using INF370_2023_Web_API.ViewModel;


namespace INF370_2023_Web_API.Controllers
{
    
    public class UsersController : ApiController
    {
        private readonly Entities db = new Entities();


        // 1.1 Dependency injection
        private readonly IUsers _userRepo;

        // 1.2 Dependency injection
        public UsersController(IUsers userRepo)
        {
            this._userRepo = userRepo;
        }

        //Auto-generated code

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.UserID == id) > 0;
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

        ////////////////////////////////// NON-AUTO GENERATED CODE BELOW //////////////////////////////////

        //     [HttpPost]
        //    [Route("api/Login")]
        //   public async Task<object> Login([FromBody]User User)
        //   {
        //       try
        //{
        //          if (!ModelState.IsValid)
        //         {
        //             return new { Status = 400, Message = "Invalid data" };
        //         }

        //         return await _userRepo.Login(User);
        //    }
        //   catch (Exception)
        //   {
        //       dynamic Error = new ExpandoObject();
        //       Error.Status = 500;
        //      Error.Message = "Internal server error, please try again";
        //      return BadRequest(Error.Error); ;
        //  }
        // }

        public async Task<User> refreshUserGuid(User user)
        {
            
            
                db.Configuration.ProxyCreationEnabled = false;
                User User = await db.Users.Where(x => x.UserID == user.UserID).FirstOrDefaultAsync();

                if (User.GUID == null)
                {
                    User.GUID = Guid.NewGuid().ToString();
                }
                await db.SaveChangesAsync();
                //db.Configuration.ProxyCreationEnabled = false;
                return (User);
            

            
            
                
            
        }

        [HttpPost]
        [Route("api/Login")]
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

                    dynamic toReturn = new ExpandoObject();


                    if (user != null)
                    {
                        if (user.Activity == "True")
                        {
                            return await refreshUserGuid(user);
                        }

                        else if (user.Activity == "False")
                        {
                            dynamic disabled = new ExpandoObject();
                            disabled.Error = ("Your Account is Disabled");
                            return BadRequest(disabled.Error);
                        }
                    }

                    dynamic obj = new ExpandoObject();
                    obj.Error = ("Email/Password invalid.");
                    return BadRequest(obj.Error);
                }

                else
                {
                    dynamic toReturn = new ExpandoObject();
                    toReturn.Error = ("Please try again.");
                    return BadRequest(toReturn.Error);
                }
            }
            catch (Exception e)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Error = (e.Message);
                return BadRequest(toReturn.Error);
            }
        }

        [HttpGet]
        [Route("api/Logout/{token}")]
        public async Task<object>Logout(string token)
        {
            try 
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _userRepo.Logout(token);
            }
            catch (Exception)
            {
                dynamic Error = new ExpandoObject();
                Error.Status = 500;
                Error.Message = "Internal server error, please try again";
                return BadRequest(Error.Error); ;
            }
        }

        [HttpGet]
        [Route("api/ValidateUser/{token}")]
        public async Task<object> validateUser(string token)
        {
            try
            {
                return await _userRepo.validateUser(token);
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }




        //Re and De-activate user/s

        [HttpPut]
        [Route("api/ReactivateUser/{id}")]
        public async Task<object> ReactivateUser(int id)
        {
            try 
            {
                return await _userRepo.ReactivateUser(id);
            }
            catch (Exception)
            {
                dynamic Error = new ExpandoObject();
                Error.Status = 501;
                Error.Message = "Internal server error, please try again";
                return Error;
            }
        }
        
        [HttpPut]
        [Route("api/DeactivateUser/{id}")]
        public async Task<object> DeactivateUser(int id)
        {
            try 
            {
                return await _userRepo.DeactivateUser(id);
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }

        [HttpGet]
        [Route("api/getUserName/{id}")]
        public async Task<object> getUserName(int id)
        {
            try
            {
                return await _userRepo.getUserName(id);
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }
 
        [HttpPost]
        [Route("api/NewStudent")]
        public async Task<object> NewStudent([FromBody]StudentViewModel student)
        {

            try 
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                if (student.TitleID == 0)
                {
                    return new { Status = 600, Message = "Please select a Title from the Title dropdown" };
                }

                return await _userRepo.NewStudent(student);
               // return _userRepo.newStudent(student).Result;
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }

        }

        [HttpGet]
        [Route("api/GetDisabledUsers")]
        public async Task<object> GetDisabledUsers()
        {
            return await _userRepo.GetDisabledUsers();
        }

        //Create Employee

       // [HttpPost]
       // [Route("api/NewEmployee")]
       // public async Task<object> NewEmployee([FromBody]EmployeeViewModel employee)
      //  //{
         //   try 
         //   {
          //      if (!ModelState.IsValid)
          //      {
          //          return new { Status = 400, Message = "Invalid data" };
          //      }

           //     return await _userRepo.NewEmployee(employee);
          //  }
          //  catch (Exception e)
          //  {
                //dynamic toReturn = new ExpandoObject();
                // toReturn.Status = 501;
                //toReturn.Message = "Internal Server, error please try again";
                // return toReturn;
           ////     return e.ToString();
           // }
      //  }

        [HttpPut]
        [Route("api/UpdateEmployeeProfile/{id}")]
        public async Task<object>UpdateEmployeeProfile(int id, Employee employee)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                

                return await _userRepo.UpdateEmployeeProfile(id, employee);
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        [HttpPut]
        [Route("api/UpdateStudentProfile/{id}")]
        public async Task<object> UpdateStudentProfile(int id, Student student)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }



                return await _userRepo.UpdateStudentProfile(id, student);
            }



            catch (Exception e)
            {
                return e.ToString();
            }
        }

        [HttpPost]
        [Route("api/AuditLog")]
        public async Task<object> PostAuditLog(AuditLog audit)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _userRepo.PostAuditLog(audit);
            }
            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }

        [HttpGet]
        [Route("api/GetUsers")]
        public async Task<object> GetUsers()
        {
            try
            {
                return await _userRepo.GetUsers();
            }

            catch (Exception)
            {
                dynamic toReturn = new ExpandoObject();
                toReturn.Status = 501;
                toReturn.Message = "Internal Server, error please try again";
                return toReturn;
            }
        }

        [HttpPost]
        [Route("api/ForgotPassword")]
        public async Task<object> ForgotPassword([FromBody] User user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _userRepo.ForgotPassword(user);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPost]
        [Route("api/NewPassword")]
        public async Task<object> NewPassword([FromBody] User usr)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }

                return await _userRepo.NewPassword(usr);
            }
            
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }







    }
}