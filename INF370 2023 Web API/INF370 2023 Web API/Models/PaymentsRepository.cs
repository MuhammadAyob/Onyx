using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class PaymentsRepository : IPayments
    {
        private readonly Entities db;

        public PaymentsRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> GetInvoices(int id)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var invoices = await db.Carts
        .Where(cart => cart.StudentID == id)
        .Join(db.CartCourses,
            cart => cart.CartID,
            cartCourse => cartCourse.CartID,
            (cart, cartCourse) => new { Cart = cart, CartCourse = cartCourse })
        .Join(db.Courses,
            joinResult => joinResult.CartCourse.CourseID,
            course => course.CourseID,
            (joinResult, course) => new { joinResult.Cart, joinResult.CartCourse, Course = course })
        .Join(db.VATs,
            joinResult => joinResult.Cart.VatID,
            vat => vat.VatID,
            (joinResult, vat) => new { joinResult.Cart, joinResult.CartCourse, joinResult.Course, VAT = vat })
        .GroupBy(joinResult => new
        {
            joinResult.Cart.CartID,
            joinResult.Cart.PurchaseNumber,
            joinResult.Cart.Total,
            joinResult.Cart.VatID,
            joinResult.Cart.Date,
            joinResult.VAT.VatAmount
        })
        .Select(groupedResult => new
        {
            CartID = groupedResult.Key.CartID,
            Date= groupedResult.Key.Date,
            PurchaseNumber = groupedResult.Key.PurchaseNumber,
            Total = groupedResult.Key.Total,
            VatID = groupedResult.Key.VatID,
            VatAmount = groupedResult.Key.VatAmount,
            Courses = groupedResult.Select(item => new
            {
                CourseID = item.Course.CourseID,
                CourseName = item.Course.Name,
                PriceAtTimeOfPurchase = item.CartCourse.PriceAtTimeOfPurchase
            })
        })
        .ToListAsync();

                return invoices;


            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public async Task<object> NewCart(CartDetails details)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var vat = await db.VATs.OrderByDescending(z => z.VatDate).FirstOrDefaultAsync();

                Cart cart = new Cart();
                cart.CartID = 0;
                cart.StudentID = details.StudentID;
                cart.Total = details.Total;
                cart.Date = DateTime.Now;

                string PN = details.PayFastNumber.ToString();

                cart.PurchaseNumber = PN;
                cart.VatID = vat.VatID;
                db.Carts.Add(cart);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Cart created" };
            }

            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public async Task<object> NewPurchase(int id, dynamic cartObject)
        {
            try
            {

                var purchaseNumber = Convert.ToString(id);
                Cart newcart = await db.Carts.Where(x => x.PurchaseNumber == purchaseNumber).OrderByDescending(z=>z.Date).FirstOrDefaultAsync();
                foreach (var item in cartObject)
                {
                    CartCourse cartCourse = new CartCourse();
                    cartCourse.CartID = newcart.CartID;
                    cartCourse.CourseID = item.CourseID;
                    cartCourse.PriceAtTimeOfPurchase = item.Price;

                    db.CartCourses.Add(cartCourse);
                    await db.SaveChangesAsync();

                    StudentCourse sc = new StudentCourse();
                    sc.CourseID = item.CourseID;
                    sc.StudentID = newcart.StudentID;
                    db.StudentCourses.Add(sc);
                    await db.SaveChangesAsync();
                }

                var student = await db.Students.Where(x => x.StudentID == newcart.StudentID).FirstOrDefaultAsync();

                var email = student.Email;
                var name = student.Name;
                var surname = student.Surname;
                

                await SendInvoice(email, name, surname, newcart.Total, purchaseNumber);
                

                return new { Status = 200, Message = "Purchase success" };
            }

            catch(Exception ex)
            {
                return ex.ToString();
            }
        }

        private async Task SendInvoice(string emailID, string name, string surname, dynamic total, string purchaseNumber)
        {
            var fromEmailAccount = "dseiqueries@gmail.com";
            var fromEmailAccountPassword = "epqshwdnwmokortk";

            var fromAddress = new MailAddress(fromEmailAccount);
            var toAddress = new MailAddress(emailID);

            var subject = "Your payment was successful!";
            var message = "Dear " + name + " " + surname + "<br/><br/>We have successfully received your payment via PayFast" +
                     "<br/>"
                     + "<br>"
                     + "Below are your digital receipt details:" +
                    "<br/><br/>" + "Purchase Number: " + "#" + purchaseNumber +
                    "<br/>" + "Total: " +  "R" + total +
                   
                   "<br/><br/>A more detailed invoice can be found by navigating to the 'Invoices' tab on your student portal." +
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