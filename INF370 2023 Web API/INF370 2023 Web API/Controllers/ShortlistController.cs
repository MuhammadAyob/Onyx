using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class ShortlistController : ApiController
    {
        private readonly IShortList _shortListRepo;

        public ShortlistController(IShortList shortListRepo)
        {
            this._shortListRepo = shortListRepo;
        }
    }
}
