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
    
    public partial class ShortList
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ShortList()
        {
            this.InterviewSlots = new HashSet<InterviewSlot>();
        }
    
        public int ShortListID { get; set; }
        public int ApplicationID { get; set; }
    
        public virtual Application Application { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<InterviewSlot> InterviewSlots { get; set; }
    }
}
