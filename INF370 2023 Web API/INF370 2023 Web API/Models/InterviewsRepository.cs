using INF370_2023_Web_API.ViewModel;
using iTextSharp.text.pdf.qrcode;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class InterviewsRepository:IInterviews
    {
        private readonly Entities db;

        public InterviewsRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddInterviewSlot(InterviewDetails interview)
        {
            try
            {
                var getShort = await db.ShortLists.Where(x => x.ApplicationID == interview.ApplicationID).FirstOrDefaultAsync();
                
                // Create Slot

                InterviewSlot slot = new InterviewSlot();
                slot.InterviewSlotID = 0;
                slot.ShortListID = getShort.ShortListID;
                slot.InterviewDate = interview.InterviewDate;
                slot.StartTime = interview.StartTime;

                // generate code

                var code = new Random().Next(100000, 1000000);

                slot.InterviewCode = code;
                slot.EndTime = interview.EndTime;
                slot.Attended = "Awaiting";
                db.InterviewSlots.Add(slot);
                await db.SaveChangesAsync();

                var application = await db.Applications.Where(x => x.ApplicationID == interview.ApplicationID).FirstOrDefaultAsync();
                var applicant = await db.Applicants.Where(x => x.ApplicantID == application.ApplicantID).FirstOrDefaultAsync();

                string name = applicant.Name;
                string surname = applicant.Surname;
                string email = applicant.Email;
                string date = interview.InterviewDate.ToString("dd/MM/yyyy");
                string startTime = Convert.ToString(interview.StartTime);
                string endTime = Convert.ToString(interview.EndTime);

                // Send Invite
                await SendInvite(email, name, surname, date, startTime, endTime, code);
                
                return new { Status = 200, Message = "Slot added" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetPending()
        {
            try
            {
                List<dynamic> listUpdate = new List<dynamic>();

                List<Application> applications = await db.Applications.Where(s => s.ApplicationStatusID == 3).ToListAsync();


                foreach (Application request in applications)
                {
                    dynamic obj = new ExpandoObject();
                    obj = await db.Applications.Where(s => s.ApplicationID == request.ApplicationID)
                        .Include(s => s.Applicant)
                        .Select(s => new
                        {
                            ApplicantID = s.ApplicantID,
                            Name = s.Applicant.Name,
                            Surname = s.Applicant.Surname,
                            Email = s.Applicant.Email,
                            JobOpp = s.JobOpportunity.JobOppTitle,
                            ApplicationID = s.ApplicationID,

                        }).FirstOrDefaultAsync();

                    listUpdate.Add(obj);
                }
                return listUpdate;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
       
        private async Task SendInvite(string emailID, string name, string surname, string date, string startTime, string endTime, int code)
        {
            string location = "https://goo.gl/maps/v3oBkBV3DASbmxBq9";

            // Create QR Code

            string fileName = "qrCode.pdf";
            string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"attachments\", fileName);


           // QRCodeWriter.CreateQrCode(qrCode, 500, QRCodeWriter.QrErrorCorrectionLevel.Medium).SaveAsPdf(path);

            /////
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Job Application: Interview Invitation";
            var message = "Dear " + name + " " + surname + "<br/><br/>Thank you for your application! We would like to invite you for an interview." +
                     "<br/>" + "Below are your invitation details:" +
                    "<br/><br/>" + "Date: " + date +
                    "<br/>" + "Time: " + startTime + " " + "-" + " " + endTime +
                    "<br/>" + "Location: " + location +
                   "<br/><br/>Please keep your QR Code attachment safe, as it will be used to mark your attendance. " +
                "<br/><br/> If you require any further assistance please contact us at dseiqueries@gmail.com" +
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
    }
}