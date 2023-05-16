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
    public class UpdateRequestsRepository : IUpdateRequests
    {
        private readonly Entities db;
        
        public UpdateRequestsRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AcceptUpdateRequest(int id, UpdateRequest updateRequest)
        {
            try
            {
                updateRequest.UpdateRequestStatusID = 2;
                db.Entry(updateRequest).State = EntityState.Modified;

                await db.SaveChangesAsync();

                // Email and SMS parameters

                db.Configuration.ProxyCreationEnabled = false;
                var emp = await db.Employees.Where(z => z.EmployeeID == updateRequest.EmployeeID).FirstOrDefaultAsync();

                string email = emp.Email;
                string name = emp.Name;
                string surname = emp.Surname;
                string subject = updateRequest.UpdateSubject;

                // SMS Parameters
                string phone = emp.Phone;
                string cnumber = phone.Substring(1);
                string Ncode = "+27";
                string finalPhone = Ncode + cnumber;

                //// 
                string subjectFor = "Accepted";

                // Send Email
                await SendRequestEmail(email, name, surname, subject,subjectFor);

               
               
                // Send SMS
                SendRequestSMS(finalPhone, subject, name, surname, subjectFor);
               
                return new { Status = 200, Message = "Update request approved" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> AddUpdateRequest([FromBody] UpdateRequest updateRequest)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                db.UpdateRequests.Add(updateRequest);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Update Request added" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetUpdateRequestDetails()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                List<dynamic> listUpdate = new List<dynamic>();

                List<UpdateRequest> requests = await db.UpdateRequests.Where(s => s.UpdateRequestStatusID == 1).ToListAsync();

                foreach (UpdateRequest request in requests)
                {
                    dynamic obj = new ExpandoObject();
                    obj = await db.UpdateRequests.Where(s => s.UpdateRequestID == request.UpdateRequestID)
                        .Include(s => s.Employee)
                        .Select(s => new
                        {
                            UpdateRequestID = s.UpdateRequestID,
                            UpdateDesc = s.UpdateDescription,
                            UpdateSubject = s.UpdateSubject,
                            EmployeeID = s.Employee.EmployeeID,
                            EmployeeName = s.Employee.Name,
                            EmployeeSurname = s.Employee.Surname,
                            Proof = s.Proof
                        })
                        .FirstOrDefaultAsync();
                    listUpdate.Add(obj);
                }
                return listUpdate;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetUserUpdateRequestDetails(int id)
        {
            try
            {
                

                var requestList = await db.UpdateRequests.Where(x => x.EmployeeID == id && x.UpdateRequestStatusID==1).ToListAsync();

                return requestList;

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> RejectUpdateRequest(int id, UpdateRequest updateRequest)
        {
            try
            {
                updateRequest.UpdateRequestStatusID = 3;
                db.Entry(updateRequest).State = EntityState.Modified;

                await db.SaveChangesAsync();

                db.Configuration.ProxyCreationEnabled = false;
                var emp = await db.Employees.Where(z => z.EmployeeID == updateRequest.EmployeeID).FirstOrDefaultAsync();

                string email = emp.Email;
                string name = emp.Name;
                string surname = emp.Surname;
                string subject = updateRequest.UpdateSubject;

                // SMS Parameters
                string phone = emp.Phone;
                string cnumber = phone.Substring(1);
                string Ncode = "+27";
                string finalPhone = Ncode + cnumber;

                //// 
                string subjectFor = "Rejected";

                // Send Email
                await SendRequestEmail(email, name, surname, subject, subjectFor);



                // Send SMS
                SendRequestSMS(finalPhone, subject, name, surname, subjectFor);

                return new { Status = 200, Message = "Update request rejected" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        //email stuff

        private async Task SendRequestEmail(string emailID, string name, string surname, string requestSubject,string subjectFor)
        {
            var fromEmailAccount = "muhammad.ayob7@gmail.com";
            var fromEmailAccountPassword = "wkguzejivsgpirle";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Update Request Approved";
            var message="";
            
            if (subjectFor == "Accepted")
            {
                message = "Dear" + "" + name + "" + surname
                + "<br> We are pleased to inform you that your Update Request:" + requestSubject + "" + ", has been approved and we will immediately begin the process of updating your technical competencies list. Please check your assigned skills and qualifications, in due course, located on the home page of your user profile or navigate to the Skills and Qualifications tab via the sidebar navigation."
                + "<br>For further assistance or enquiries, please contact us at" + "" + fromAddress
                + "<br> Sincerely, The Darus-Salaam Centre Team";
            }

            else
            {
                message = "Dear" + "" + name + "" + surname
                + "<br> We regret to inform you that your Update Request:" + requestSubject + "" + ", has been declined. After thorough investigation, your request did not fulfill the requirements or pre-requisites needed to obtain a new set of technical competencies."
                + "<br>If you feel that this was a mistake, or require further assistance , please contact us at" + "" + fromAddress
                + "<br> Sincerely, The Darus-Salaam Centre Team";
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

        private object SendRequestSMS(string phone,string updateSubject, string name, string surname, string subjectFor)
        {
            if (subjectFor == "Accepted")
            {
                //twilio credentials

                const string accountSid = "AC86ac80700460374988d1b9e208fc290f";
                const string authToken = "063fc594e78443ee272824189d5243f5";

                //Initialize the twilio client

                TwilioClient.Init(accountSid, authToken);

                MessageResource.Create(
                    from: new PhoneNumber("+19042986677"), // From number, must be an SMS-enabled Twilio number
                    to: new PhoneNumber(phone), // To number, if using Sandbox see note above
                    body: $"Dear" + "" + name + "" + surname + "" + ", your update request:"+updateSubject+""+"has been approved. Sincerely, the Darus-Salaam Team"
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
                    body: $"Dear" + " " + name + " " + surname + ", your update request:" + " " + updateSubject + " " + "has been rejected. Sincerely, the Darus-Salaam team."
                    ); // Message content
            }

            return "Sent";
        }
    }
}