//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace INF370_2023_Web_API.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class UpdateRequest
    {
        public int UpdateRequestID { get; set; }
        public int EmployeeID { get; set; }
        public string UpdateSubject { get; set; }
        public string UpdateDescription { get; set; }
        public int UpdateRequestStatusID { get; set; }
        public byte[] Proof { get; set; }
    
        public virtual Employee Employee { get; set; }
        public virtual UpdateRequestStatu UpdateRequestStatu { get; set; }
    }
}
