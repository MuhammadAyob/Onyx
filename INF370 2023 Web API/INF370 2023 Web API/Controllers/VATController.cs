using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class VATController : ApiController
    {
        private readonly IVat _vatRepository;

        public VATController(IVat vatRepository)
        {
            this._vatRepository = vatRepository;
        }

        [HttpPost]
        [Route("api/AddVAT")]
        public async Task<object> AddVAT(VAT vat)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data request" };
                }

                return await _vatRepository.AddVAT(vat);
            }
            catch (Exception)
            {
                return new { Status = 502, Message = "Internal server error, please try again" };
            }
        }

        [HttpGet]
        [Route("api/GetVATAmounts")]
        public async Task<object> GetVATAmounts()
        {
            return await _vatRepository.GetVATAmounts();
        }

        [HttpGet]
        [Route("api/GetCurrentVAT")]
        public async Task<object> GetCurrentVat()
        {
            return await _vatRepository.GetCurrentVAT();
        }

        [HttpPut]
        [Route("api/UpdateVATAmount/{id}")]
        public async Task<object> MaintainVATAmount(int id, VAT vat)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data request" };
                }

                return await _vatRepository.MaintainVATAmount(id, vat);
            }

            catch (Exception)
            {
                return new { Status = 600, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteVAT/{id}")]
        public async Task<object> DeleteVAT(int id)
        {
            return await _vatRepository.DeleteVAT(id);
        }
    }
}
