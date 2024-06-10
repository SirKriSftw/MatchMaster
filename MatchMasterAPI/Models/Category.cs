﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MatchMasterAPI.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();
}
