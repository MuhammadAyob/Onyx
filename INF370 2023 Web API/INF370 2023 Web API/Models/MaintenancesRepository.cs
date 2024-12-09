using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace INF370_2023_Web_API.Models
{
    public class MaintenancesRepository : IMaintenances
    {
        private readonly Entities db;
        
        public MaintenancesRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddMaintenanceRequest([FromBody] Maintenance maintenance)
        {
            try
            {
                maintenance.DateLogged = DateTime.Now;
                db.Maintenances.Add(maintenance);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Maintenance Request added" };

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> ConfirmMaintenaceRequest(int id)
        {
            try
            {
                var mReq = await db.Maintenances.FindAsync(id);
                mReq.MaintenanceStatusID = 3;
                mReq.DateResolved = DateTime.Now;

                db.Entry(mReq).State = EntityState.Modified;
                await db.SaveChangesAsync();

                var _name = await db.Employees.Where(z=>z.UserID==mReq.UserID).FirstOrDefaultAsync();


                if (_name != null)
                {
                    string name = _name.Name;
                    string surname = _name.Surname;

                   

                    string emailID = _name.Email;
                    dynamic dateLogged = mReq.DateLogged;
                    string subjectFor = "Confirmed";


                    //Send Email
                    await SendMaintenanceEmail(emailID, name, surname, mReq, subjectFor, dateLogged);

                   
                }

                else
                {
                    var _sName = await db.Students.Where(z=>z.UserID==mReq.UserID).FirstOrDefaultAsync();
                    string name = _sName.Name;
                    string surname = _sName.Surname;
                   
                  

                    string emailID = _sName.Email;
                    string maintenanceRequest = mReq.Description;
                    dynamic dateLogged = mReq.DateLogged;
                    string subjectFor = "Confirmed";


                    //Send Email
                    await SendMaintenanceEmail(emailID, name, surname, mReq, subjectFor, dateLogged);

                   
                }


                return new { Status = 200, Message = "Maintenance Request confirmed" };
            }

            catch (Exception e)
            {
                return e.ToString();
            }
        }

        public async Task<object> DeleteMaintenanceRequest(int id)
        {
            try
            {
                var mReq = await db.Maintenances.FindAsync(id);
                mReq.MaintenanceStatusID = 4;
                mReq.DateResolved = DateTime.Now;

                db.Entry(mReq).State = EntityState.Modified;
                await db.SaveChangesAsync();
                var _name = await db.Employees.Where(x=>x.UserID==mReq.UserID).FirstOrDefaultAsync();


                if (_name != null)
                {
                    string name = _name.Name;
                    string surname = _name.Surname;


                    string emailID = _name.Email;
                  
                    dynamic dateLogged = mReq.DateLogged;
                    string subjectFor = "Discarded";


                    //Send Email
                    await SendMaintenanceEmail(emailID, name, surname, mReq, subjectFor, dateLogged);

                }

                else
                {
                    var _sName = await db.Students.Where(x=>x.UserID==mReq.UserID).FirstOrDefaultAsync();
                    string name = _sName.Name;
                    string surname = _sName.Surname;
                   
                   

                    string emailID = _sName.Email;
                   
                    dynamic dateLogged = mReq.DateLogged;
                    string subjectFor = "Discarded";


                    //Send Email
                    await SendMaintenanceEmail(emailID, name, surname, mReq, subjectFor, dateLogged);

                
                }

                return new { Status = 200, Message = "Maintenance Request discarded" };
            }

            catch (Exception e)
            {
                return e.ToString();
            }
        }

        public async Task<object> GetMaintenance(int id)
        {
            try
            {
                List<dynamic> maintenanceList = new List<dynamic>();

                List<Maintenance> MLog = await db.Maintenances.Where(x => x.MaintenanceID==id).ToListAsync();

                foreach (Maintenance ReqLog in MLog)
                {
                    dynamic obj = new ExpandoObject();

                    obj.MaintenanceID = ReqLog.MaintenanceID;
                    obj.UserID = ReqLog.UserID;
                    obj.Username = ReqLog.User.Username;
                    obj.MaintenanceTypeID = ReqLog.MaintenanceTypeID;
                    obj.MaintenanceType = ReqLog.MaintenanceType.Type;
                    obj.MaintenanceStatusID = ReqLog.MaintenanceStatusID;
                    obj.MaintenanceStatus = ReqLog.MaintenanceStatu.Status;
                    obj.MaintenancePriorityID = ReqLog.MaintenancePriorityID;
                    obj.MaintenancePriority = ReqLog.MaintenancePriority.Priority;
                    obj.Description = ReqLog.Description;
                    obj.Location = ReqLog.Location;
                    obj.DateLogged = ReqLog.DateLogged.ToShortDateString();
                    obj.DateResolved = ReqLog.DateResolved;
                    obj.Image = ReqLog.Image;

                    maintenanceList.Add(obj);
                }
                return maintenanceList;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetMaintenanceList()
        {
            try
            {
              //  db.Configuration.ProxyCreationEnabled = false;
                List<dynamic> maintenanceList = new List<dynamic>();

                List<Maintenance> MLog = await db.Maintenances.Where(x=>x.MaintenanceStatusID==1 || x.MaintenanceStatusID==2).ToListAsync();

                foreach (Maintenance ReqLog in MLog)
                {
                    dynamic obj = new ExpandoObject();
                    
                    obj.MaintenanceID = ReqLog.MaintenanceID;
                    obj.UserID = ReqLog.UserID;
                    obj.Username = ReqLog.User.Username;
                    obj.MaintenanceTypeID = ReqLog.MaintenanceTypeID;
                    obj.MaintenanceType = ReqLog.MaintenanceType.Type;
                    obj.MaintenanceStatusID = ReqLog.MaintenanceStatusID;
                    obj.MaintenanceStatus = ReqLog.MaintenanceStatu.Status;
                    obj.MaintenancePriorityID = ReqLog.MaintenancePriorityID;
                    obj.MaintenancePriority = ReqLog.MaintenancePriority.Priority;
                    obj.Description = ReqLog.Description;
                    obj.Location = ReqLog.Location;
                    obj.DateLogged = ReqLog.DateLogged.ToShortDateString();
                    obj.DateResolved = ReqLog.DateResolved;
                    obj.Image = ReqLog.Image;
                    
                    maintenanceList.Add(obj);
                }
                return maintenanceList;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetUserMaintenanceList(int id)
        {
            try
            {
                var student = await db.Students.Where(x => x.StudentID == id).FirstOrDefaultAsync();
                
                List<dynamic> listMaintenanceReqs = new List<dynamic>();

                List<Maintenance> maintenanceReqs = 
                    await
                    db.Maintenances
                    .Where(x=>x.UserID== student.UserID && (x.MaintenanceStatusID==1 || x.MaintenanceStatusID==2) )
                    .ToListAsync();

                foreach (Maintenance maintenanceReq in maintenanceReqs)
                {
                    
                    dynamic obj = new ExpandoObject();
                    obj.MaintenanceID = maintenanceReq.MaintenanceID;
                    obj.UserID = maintenanceReq.UserID;
                    obj.Username = maintenanceReq.User.Username;
                    obj.MaintenanceTypeID = maintenanceReq.MaintenanceTypeID;
                    obj.MaintenanceType = maintenanceReq.MaintenanceType.Type;
                    obj.MaintenanceStatusID = maintenanceReq.MaintenanceStatusID;
                    obj.MaintenanceStatus = maintenanceReq.MaintenanceStatu.Status;
                    obj.MaintenancePriorityID = maintenanceReq.MaintenancePriorityID;
                    obj.MaintenancePriority = maintenanceReq.MaintenancePriority.Priority;
                    obj.Description = maintenanceReq.Description;
                    obj.Location = maintenanceReq.Location;
                    obj.DateLogged = maintenanceReq.DateLogged.ToShortDateString();
                    obj.DateResolved = maintenanceReq.DateResolved;
                    obj.Image = maintenanceReq.Image;
                    listMaintenanceReqs.Add(obj);
                    

                }

                return listMaintenanceReqs;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

       
        public async Task<object> UpdateMaintenanceRequest(int id, Maintenance maintenance)
        {
            try
            {
                var mReq = await db.Maintenances.FindAsync(id);

                mReq.MaintenanceTypeID = maintenance.MaintenanceTypeID;
                mReq.MaintenancePriorityID = maintenance.MaintenancePriorityID;

                db.Entry(mReq).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Maintenance Request updated." };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
        
        // email stuff

        private async Task SendMaintenanceEmail(string emailID, string name, string surname, Maintenance maintenanceRequest, string subjectFor, dynamic dateLogged)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "";
            var message = "";

          

            if(subjectFor == "Confirmed")
            {
                subject = "Your Maintenance Request has been resolved.";
                message = "Dear" + " " + name + " " + surname
                + "<br> <br> We are pleased to inform you that your Maintenance Request has been resolved!"
                + "<br> <br>"
                + "Brief summary of your maintenance query details: " + "<br>" + 
                "Date Logged:" + " " + maintenanceRequest.DateLogged.ToString("dd/MM/yyyy") + "<br>" + 
                "Issue:" + " " + maintenanceRequest.Description + "<br>"

                + "<br>Thank you for taking the time and consideration to help improve the quality of the presentation and user experience of the system. " +
                "<br> We urge you to log in to your user profile to verify that the issue has been adequately resolved to your desired expectations or if it requires further enhancements by logging a new maintenance request."
                + "<br> <br> For further assistance or enquiries, please contact us at dseiqueries@gmail.com"
                + "<br/> <br> Sincerely, The Onyx Team" +
                "<br/><h5>Powered by Onyx</h5>";
            }

            else
            {
                subject = "Your Maintenance Request has been discarded.";
                message = "Dear" + " " + name + " " + surname
                + "<br> <br> We regret to inform you that your Maintenance Request has been discarded!"
                + "<br> <br>"
                + "Brief summary of your maintenance query details: " + "<br>" +
                "Date Logged:" + " " + maintenanceRequest.DateLogged.ToString("dd/MM/yyyy") + "<br>" +
                "Issue:" + " " + maintenanceRequest.Description + "<br>"
                + "<br>Thank you for taking the time and consideration to help improve the quality of the presentation and user experience of the system. <br> However, after thorough investigation our administrative team have decided on terminating the investigation. The request was deemed as unwarranted, with no significant underlying issue at hand."
                + "<br> <br> If you feel that this was a mistake, or require further assistance, please contact us at dseiqueries@gmail.com" +
                 "<br/> <br> Sincerely, The Onyx Team" +
                 "<br/><h5>Powered by Onyx</h5>";
            }




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



        // sms stuff

        private void SendMaintenanceSMS(string phone, string maintenanceRequest, string name, string surname, string subjectFor, dynamic dateLogged)
        {
            if (subjectFor == "Reviewed")
            {
                //twilio credentials

                const string accountSid = "AC86ac80700460374988d1b9e208fc290f";
                const string authToken = "063fc594e78443ee272824189d5243f5";

                //Initialize the twilio client

                TwilioClient.Init(accountSid, authToken);

                MessageResource.Create(
                    from: new PhoneNumber("+19042986677"), // From number, must be an SMS-enabled Twilio number
                    to: new PhoneNumber(phone), // To number, if using Sandbox see note above
                    body: $"Dear" + "" + name + "" + surname + "" + ", your maintenance request:" + maintenanceRequest + "" 
                    + ",logged on:" + dateLogged + ", is currently under investigation. Stayed tuned for further updates. Yours sincerely, the Darus-Salaam Centre Team."
                    ); // Message content


            }

            else if(subjectFor == "Confirmed")
            {
                //twilio credentials

                const string accountSid = "AC86ac80700460374988d1b9e208fc290f";
                const string authToken = "063fc594e78443ee272824189d5243f5";

                //Initialize the twilio client

                TwilioClient.Init(accountSid, authToken);

                MessageResource.Create(
                    from: new PhoneNumber("+19042986677"), // From number, must be an SMS-enabled Twilio number
                    to: new PhoneNumber(phone), // To number, if using Sandbox see note above
                    body: $"Dear" + "" + name + "" + surname + "" + ", your maintenance request:" + maintenanceRequest + ""
                    + ",logged on:" + dateLogged + ", has been resolved. We urge you to log in to your user profile to view the the amended changes. Yours sincerely, the Darus-Salaam Centre Team."
                    ); // Message content
            }

            else
            {
                //twilio credentials

                const string accountSid = "AC86ac80700460374988d1b9e208fc290f";
                const string authToken = "063fc594e78443ee272824189d5243f5";

                //Initialize the twilio client

                TwilioClient.Init(accountSid, authToken);

                MessageResource.Create(
                    from: new PhoneNumber("+19042986677"), // From number, must be an SMS-enabled Twilio number
                    to: new PhoneNumber(phone), // To number, if using Sandbox see note above
                    body: $"Dear" + "" + name + "" + surname + "" + ", your maintenance request:" + maintenanceRequest + ""
                    + ",logged on:" + dateLogged + ", has been discarded. Your request was deemed as unwarranted, with no significant underlying issue at hand. Yours sincerely, the Darus-Salaam Centre Team."
                    ); // Message content
            }

           // return "Sent";
        }
    }
}