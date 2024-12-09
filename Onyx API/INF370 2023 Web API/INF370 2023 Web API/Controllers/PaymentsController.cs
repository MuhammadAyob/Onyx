using INF370_2023_Web_API.Models;
using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class PaymentsController : ApiController
    {
        private readonly IPayments _paymentRepo;

        public PaymentsController(IPayments paymentRepo)
        {
            this._paymentRepo = paymentRepo;
        }

        private readonly Entities db = new Entities();

      [HttpPost]
      [Route("api/NewCart")]
      public async Task<object> NewCart(CartDetails details)
      {
         return await _paymentRepo.NewCart(details);
      }

        [HttpPut]
        [Route("api/NewPurchase/{id}")]
        public async Task <object> NewPurchase(int id, dynamic cartObject)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Data invalid" };
                }

                return await _paymentRepo.NewPurchase(id, cartObject);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpGet]
        [Route("api/GetInvoices/{id}")]
        public async Task<object>GetInvoices(int id)
        {
            return await _paymentRepo.GetInvoices(id);
        }
    }
}
