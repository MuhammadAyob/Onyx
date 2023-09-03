using INF370_2023_Web_API.ViewModel;
using IronBarCode;
using QRCoder;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Drawing;
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
                if(DateTime.Today.Date == interview.InterviewDate && DateTime.Now.TimeOfDay > interview.StartTime)
                {
                    return new { Status = 250, Message = "Start time today has passed" };
                }

                if (interview.EndTime <= interview.StartTime)
                {
                    return new { Status = 251, Message = "End time is less than or equal to start time" };
                }

                var max = await db.MaxSlotsPerDays.FirstOrDefaultAsync();
                var count = await db.InterviewSlots.CountAsync(x => x.InterviewDate == interview.InterviewDate);
                if (count >= max.NumberOfSlots)
                {
                    return new { Status = 300, Message = "Max slots reached" };
                }

                // Make sure doesn't overlap
                List<InterviewSlot> interviewSlots = await db.InterviewSlots.Where(x => x.InterviewDate == interview.InterviewDate).ToListAsync();

                //Loop through list and check for overlaps

                foreach(var slott in interviewSlots)
                {
                    if (interview.StartTime <= slott.EndTime && interview.EndTime >= slott.StartTime)
                    {
                        return new { Status = 350, Message = "The new interview slot intersects with an existing slot." };
                    }
                }
                var getShort = await db.ShortLists.Where(x => x.ApplicationID == interview.ApplicationID).FirstOrDefaultAsync();
                
                // Create Slot

                InterviewSlot slot = new InterviewSlot();
                slot.InterviewSlotID = 0;
                slot.ShortListID = getShort.ShortListID;
                slot.InterviewDate = interview.InterviewDate;
                slot.StartTime = interview.StartTime;

                // generate code

                var code = new Random().Next(100000, 1000000);

                string qrCode = Convert.ToString(code);
                slot.InterviewCode = qrCode;
                slot.EndTime = interview.EndTime;
                slot.Attended = "No";
                slot.DateAttended = null;
                db.InterviewSlots.Add(slot);
                await db.SaveChangesAsync();

                var application = await db.Applications.Where(x => x.ApplicationID == interview.ApplicationID).FirstOrDefaultAsync();

                application.ApplicationStatusID = 4;
                db.Entry(application).State = EntityState.Modified;
                await db.SaveChangesAsync();

                var applicant = await db.Applicants.Where(x => x.ApplicantID == application.ApplicantID).FirstOrDefaultAsync();

                string name = applicant.Name;
                string surname = applicant.Surname;
                string email = applicant.Email;
                string date = interview.InterviewDate.ToString("dd/MM/yyyy");
                string startTime = Convert.ToString(interview.StartTime);
                string endTime = Convert.ToString(interview.EndTime);

                // Send Invite
                await SendInvite(email, name, surname, date, startTime, endTime, qrCode);
                
                return new { Status = 200, Message = "Slot added" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteInterviewSlot(int id)
        {
            try
            {
                var interview = await db.InterviewSlots.FindAsync(id);
                var shortlist = await db.ShortLists.Where(x => x.ShortListID == interview.ShortListID).FirstOrDefaultAsync();
                var application = await db.Applications.Where(x => x.ApplicationID == shortlist.ApplicationID).FirstOrDefaultAsync();
                var applicant = await db.Applicants.Where(x => x.ApplicantID == application.ApplicantID).FirstOrDefaultAsync();

                db.InterviewSlots.Remove(interview);
                await db.SaveChangesAsync();

                application.ApplicationStatusID = 3;
                db.Entry(application).State = EntityState.Modified;
                await db.SaveChangesAsync();

                // Send Email
                string name = applicant.Name;
                string surname = applicant.Surname;
                string email = applicant.Email;
                string date = interview.InterviewDate.ToString("dd/MM/yyyy");
                //string dateAttended = interview.DateAttended.ToString("dd/MM/yyyy");
                string startTime = Convert.ToString(interview.StartTime);
                string endTime = Convert.ToString(interview.EndTime);

                await SendCancelled(email, name, surname, startTime, endTime, date, interview);
                return new { Status = 200, Message = "Interview Cancelled" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetInterviewSlots()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var InterviewSlots = await db.InterviewSlots
                    .Join(db.ShortLists,
                        interview => interview.ShortListID,
                        shortlist => shortlist.ShortListID,
                        (interview, shortlist) => new { Interview = interview, Shortlist = shortlist })
                    .Join(db.Applications,
                        interviewShortlist => interviewShortlist.Shortlist.ApplicationID,
                        application => application.ApplicationID,
                        (interviewShortlist, application) => new { interviewShortlist.Interview, interviewShortlist.Shortlist, Application = application })
                    .Join(db.Applicants,
                        interviewShortlistApplication => interviewShortlistApplication.Application.ApplicantID,
                        applicant => applicant.ApplicantID,
                        (interviewShortlistApplication, applicant) => new { interviewShortlistApplication.Interview, interviewShortlistApplication.Shortlist, interviewShortlistApplication.Application, Applicant = applicant })
                    .Join(db.JobOpportunities,
                        interviewShortlistApplication => interviewShortlistApplication.Application.JobOppID,
                        jobOpportunity => jobOpportunity.JobOppID,
                        (interviewShortlistApplication, jobOpportunity) => new { interviewShortlistApplication.Interview, interviewShortlistApplication.Shortlist, interviewShortlistApplication.Application, interviewShortlistApplication.Applicant, JobOpportunity = jobOpportunity })
                    .Select(i => new
                    {
                        InterviewSlotID = i.Interview.InterviewSlotID,
                        InterviewDate = i.Interview.InterviewDate,
                        StartTime = i.Interview.StartTime,
                        EndTime = i.Interview.EndTime,
                        //Attended = i.Interview.Attended,
                        //ShortlistID = i.Shortlist.ShortListID,
                        ApplicationID = i.Application.ApplicationID,
                        Name = i.Applicant.Name,
                        Surname = i.Applicant.Surname,
                        JobOpp = i.JobOpportunity.JobOppTitle,
                        Code = i.Interview.InterviewCode,
                        Attended = i.Interview.Attended,
                        DateAttended = i.Interview.DateAttended
                    })
                    .ToListAsync();

                return InterviewSlots;

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

        public async Task<object> UpdateInterviewSlot(int id, InterviewDetails interview)
        {
            try
            {
                if (DateTime.Today.Date == interview.InterviewDate && DateTime.Now.TimeOfDay > interview.StartTime)
                {
                    return new { Status = 250, Message = "Start time today has passed" };
                }

                if (interview.EndTime <= interview.StartTime)
                {
                    return new { Status = 251, Message = "End time is less than or equal to start time" };
                }


                var max = await db.MaxSlotsPerDays.FirstOrDefaultAsync();
                var count = await db.InterviewSlots.CountAsync(x => x.InterviewDate == interview.InterviewDate && x.InterviewSlotID!=interview.InterviewSlotID);
                var slot = await db.InterviewSlots.Where(x => x.InterviewSlotID == interview.InterviewSlotID).FirstOrDefaultAsync();
                if (slot.InterviewDate != interview.InterviewDate && count >= max.NumberOfSlots)
                {
                    return new { Status = 300, Message = "Max slots reached" };
                }

                // Make sure doesn't overlap
                List<InterviewSlot> interviewSlots = await db.InterviewSlots.Where(x => x.InterviewDate == interview.InterviewDate && x.InterviewSlotID != interview.InterviewSlotID).ToListAsync();

                //Loop through list and check for overlaps

                foreach (var slott in interviewSlots)
                {
                    if (interview.StartTime <= slott.EndTime && interview.EndTime >= slott.StartTime)
                    {
                        return new { Status = 350, Message = "The new interview slot intersects with an existing slot." };
                    }
                }

                var getShort = await db.ShortLists.Where(x => x.ApplicationID == interview.ApplicationID).FirstOrDefaultAsync();

                // Update Slot

                // generate code

                var code = new Random().Next(100000, 1000000);

                string qrCode = Convert.ToString(code);
                slot.InterviewCode = qrCode;
                slot.InterviewDate = interview.InterviewDate;
                slot.StartTime = interview.StartTime;
                slot.EndTime = interview.EndTime;
                slot.Attended = "No";
                slot.DateAttended = null;
                db.Entry(slot).State = EntityState.Modified;
                await db.SaveChangesAsync();

                var application = await db.Applications.Where(x => x.ApplicationID == interview.ApplicationID).FirstOrDefaultAsync();

              

                var applicant = await db.Applicants.Where(x => x.ApplicantID == application.ApplicantID).FirstOrDefaultAsync();

                string name = applicant.Name;
                string surname = applicant.Surname;
                string email = applicant.Email;
                string date = interview.InterviewDate.ToString("dd/MM/yyyy");
                string startTime = Convert.ToString(interview.StartTime);
                string endTime = Convert.ToString(interview.EndTime);

                // Send invite
                await SendUpdatedInvite(email, name, surname, date, startTime, endTime, qrCode);

                return new { Status = 200, Message = "Slot updated" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        private async Task SendInvite(string emailID, string name, string surname, string date, string startTime, string endTime, string code)
        {
            string location = "https://goo.gl/maps/v3oBkBV3DASbmxBq9";

            // Create QR Code

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(code, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);

            MemoryStream qrCodeStream = new MemoryStream();
            qrCodeImage.Save(qrCodeStream, System.Drawing.Imaging.ImageFormat.Png);
            qrCodeStream.Position = 0;

            /////
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Job Application: Interview Invitation";
            var message = "Dear " + name + " " + surname + "<br/><br/>We would like to invite you for an interview." +
                     "<br/>" 
                     +"<br>"
                     + "Below are your invitation details:" +
                    "<br/><br/>" + "Date: " + date +
                    "<br/>" + "Time: " + startTime + " " + "-" + " " + endTime +
                    "<br/>" + "Location: " + location +
                   "<br/><br/>Please keep your QR Code attachment safe, as it will be used as part of the verification process. " +
                "<br/><br/> If you require any further assistance please contact us at dseiqueries@gmail.com" +
                    "<br/> Sincerely, The Onyx Team" +
                    "<br/><h5>Powered by Onyx</h5>";


            using (var compiledMessage = new MailMessage(fromAddress, toAddress))
            {
                compiledMessage.Subject = subject;
                compiledMessage.Body = string.Format(message);
                compiledMessage.IsBodyHtml = true;

                compiledMessage.Attachments.Add(new Attachment(qrCodeStream, "qr_code.png"));


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

        private async Task SendUpdatedInvite(string emailID, string name, string surname, string date, string startTime, string endTime, string code)
        {
            string location = "https://goo.gl/maps/v3oBkBV3DASbmxBq9";

            // Create QR Code

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(code, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);

            MemoryStream qrCodeStream = new MemoryStream();
            qrCodeImage.Save(qrCodeStream, System.Drawing.Imaging.ImageFormat.Png);
            qrCodeStream.Position = 0;

            /////////
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Job Application: Updated Interview Invitation";
            var message = "Dear " + name + " " + surname + 
                     "<br/>" + "Please take note of the following updated details regarding the interview process:" +
                    "<br/><br/>" + "Date: " + date +
                    "<br/>" + "Time: " + startTime + " " + "-" + " " + endTime +
                    "<br/>" + "Location: " + location +
                   "<br/><br/>Please keep your QR Code attachment safe, as it " +
                   "will be used as part of the verification process. " +
                "<br/><br/> If you require any further assistance please contact us at dseiqueries@gmail.com" +
                    "<br/> Sincerely, The Onyx Team" +
                    "<br/><h5>Powered by Onyx</h5>";


            using (var compiledMessage = new MailMessage(fromAddress, toAddress))
            {
                compiledMessage.Subject = subject;
                compiledMessage.Body = string.Format(message);
                compiledMessage.IsBodyHtml = true;

                compiledMessage.Attachments.Add(new Attachment(qrCodeStream, "qr_code.png"));

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

        private async Task SendCancelled(string emailID, string name, string surname, dynamic startTime, dynamic endTime, dynamic date, InterviewSlot interview)
        {
            

            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Job Application: Interview Termination";
            var message = "Dear " + name + " " + surname + "<br/><br/> This email serves to inform you that your allocated interview slot has been terminated:" +
                    "<br/> Date:" + date + " " + " <br> between: " + startTime + " " + "-"+" "+endTime + " " + "<br> Attended:" + interview.Attended +"<br> Date Attended:" +interview.DateAttended  + 
                    "<br>" +
                  "<br/> Please check your inbox for future updates/invites on your application" + "<br><br>" + " P.S. If the interview date, relative to the above given details, has already been attended, you can ignore this email as this is an automated email. We are doing some clearing up on our side!" +
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

        public async Task<object> ScanQRCode(int id)
        {
            try
            {
                var slot = await db.InterviewSlots.Where(x => x.InterviewSlotID == id).FirstOrDefaultAsync();
                slot.Attended = "Yes";
                slot.DateAttended = DateTime.Now;
                db.Entry(slot).State = EntityState.Modified;
                await db.SaveChangesAsync();

                var applicant = await db.ShortLists.Where(x => x.ShortListID == slot.ShortListID).Select(x => new
                {
                    Name = x.Application.Applicant.Name,
                    Surname = x.Application.Applicant.Surname,
                    Email = x.Application.Applicant.Email

                }).FirstOrDefaultAsync();  

                await SendAttended(applicant.Email, applicant.Name, applicant.Surname, slot);
                return new { Status = 200, Message = "Interview attended" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error" };
            }
        }

        private async Task SendAttended(string emailID, string name, string surname, InterviewSlot slot)
        {
            

            /////
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Job Application: Interview Attendance";
            var message = "Dear " + name + " " + surname + "<br/><br>This email hereby confirms your attendance of your interview and that the QR Code was scanned." +
                     "<br/>"
                     + "<br>"
                     + "Interview details:" +
                    "<br/><br/>" + "Date: " + slot.InterviewDate.Date +
                    "<br/>" + "Time: " + slot.StartTime + " " + "-" + " " + slot.EndTime +
                    "<br/>" + "Date Attended: " + slot.DateAttended +
                   "<br/><br/>Please keep this email safe as a form of proof of attendance. " +
                "<br/><br/> If you require any further assistance please contact us at dseiqueries@gmail.com" +
                    "<br/> Sincerely, The Onyx Team" +
                    "<br/><h5>Powered by Onyx</h5>";


            using (var compiledMessage = new MailMessage(fromAddress, toAddress))
            {
                compiledMessage.Subject = subject;
                compiledMessage.Body = string.Format(message);
                compiledMessage.IsBodyHtml = true;

                //compiledMessage.Attachments.Add(new Attachment(qrCodeStream, "qr_code.png"));


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