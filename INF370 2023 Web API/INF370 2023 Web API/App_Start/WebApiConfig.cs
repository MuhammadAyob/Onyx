using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace INF370_2023_Web_API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Used to Allow other ports to make api Calls to this API

            //////////////////////////////////////////////////////////////////////////////
            //                       Ninject Dependency injection class                 //
            //                       DO NOT TOUCH NEXT LINE!!!!!!                       //
            ////////////////////////////////////////////////////////////////////////////// 

            config.DependencyResolver = new NinjectResolver();

            // Run this command in Your Nugeet Package Console -> Install-Package Microsoft.AspNet.WebApi.Cors

            config.EnableCors(new EnableCorsAttribute(origins: "*", headers: "*", methods: "*"));
            //only allows localhost port 4200

            /* config.EnableCors(new EnableCorsAttribute(origins:"*",headers: "*", methods: "*")); */
            //Above Allows Any Port

            // Web API routes
            config.MapHttpAttributeRoutes();
           
            
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
