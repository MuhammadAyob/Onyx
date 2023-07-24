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

        public async Task<object> AcceptUpdateRequest(int id)
        {
            try
            {
                var updateRequest = await db.UpdateRequests.Where(x => x.UpdateRequestID == id).FirstOrDefaultAsync();
                updateRequest.UpdateRequestStatusID = 2;
                db.Entry(updateRequest).State = EntityState.Modified;

                await db.SaveChangesAsync();

                // Email and SMS parameters

                db.Configuration.ProxyCreationEnabled = false;
                var emp = await db.Employees.Where(z => z.EmployeeID == updateRequest.EmployeeID).FirstOrDefaultAsync();

                
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


               
               
                // Send SMS
                SendRequestSMS(finalPhone, subject, name, surname, subjectFor);
               
                return new { Status = 200, Message = "Update request approved" };
            }

            catch (Exception ex)
            {
                return ex.ToString();
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
                            Email = s.Employee.Email,
                            RSAIDNumber = s.Employee.RSAIDNumber,
                            Phone = s.Employee.Phone,
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

                db.Configuration.ProxyCreationEnabled = false;
                var requestList = await db.UpdateRequests.Where(x => x.EmployeeID == id && x.UpdateRequestStatusID==1).ToListAsync();

                return requestList;

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> RejectUpdateRequest(int id)
        {
            try
            {
                var updateRequest = await db.UpdateRequests.Where(x => x.UpdateRequestID == id).FirstOrDefaultAsync();
                updateRequest.UpdateRequestStatusID = 3;
                db.Entry(updateRequest).State = EntityState.Modified;

                await db.SaveChangesAsync();

                db.Configuration.ProxyCreationEnabled = false;
                var emp = await db.Employees.Where(z => z.EmployeeID == updateRequest.EmployeeID).FirstOrDefaultAsync();

               
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

              



                // Send SMS
                SendRequestSMS(finalPhone, subject, name, surname, subjectFor);

                return new { Status = 200, Message = "Update request rejected" };
            }

            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        

       

        // sms stuff

        private object SendRequestSMS(string phone,string updateSubject, string name, string surname, string subjectFor)
        {
            if (subjectFor == "Accepted")
            {
                //twilio credentials

                const string accountSid = "ACce735a999eed34233b872fcbd44fdfa3";
                const string authToken = "22a0833e1b796dca2555d9e8a742eae2";

                //Initialize the twilio client

                TwilioClient.Init(accountSid, authToken);


                string message = $"Dear {name} {surname},\nWe are pleased to inform you that your update request regarding '{updateSubject}' has been approved.\n\nTo view the reflected changes on your skills/qualifications, kindly log in to the Course Correspondent Mobile App.\n\nSincerely,\nThe Darus-Salaam Team";

                MessageResource.Create(
                    from: new PhoneNumber("+27600692615"), // From number, must be an SMS-enabled Twilio number
                    to: new PhoneNumber(phone), // To number, if using Sandbox see note above
                    body:message
                    ); // Message content

               
            }

            else
            {
                //twilio credentials

                const string accountSid = "ACce735a999eed34233b872fcbd44fdfa3";
                const string authToken = "22a0833e1b796dca2555d9e8a742eae2";

                //Initialize the twilio client

                TwilioClient.Init(accountSid, authToken);

                string message = $"Dear {name} {surname},\nWe regret to inform you that your update request regarding '{updateSubject}' has been unfortunately rejected.\n\nAfter careful review, the uploaded proof provided was deemed insufficient to verify the obtainment of the skill/qualification. We sincerely value your commitment to improving your skills and encourage you to resubmit the update request with a clearly outlined proof of your achievement.\n\nThank you for your understanding and cooperation.\n\nSincerely,\nThe Darus-Salaam Team";

                MessageResource.Create(
                    from: new PhoneNumber("+27600692615"), // From number, must be an SMS-enabled Twilio number
                    to: new PhoneNumber(phone), // To number, if using Sandbox see note above
                    body: message
                    ); // Message content
            }

            return "Sent";
        }
    }
}