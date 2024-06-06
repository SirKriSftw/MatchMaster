﻿using System;
using System.Collections.Generic;

namespace MatchMasterAPI.Models;

public partial class Match
{
    public int MatchId { get; set; }

    public int TournamentId { get; set; }

    public string MatchTitle { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? MatchDateTime { get; set; }

    public int? WinnerId { get; set; }

    public virtual Tournament Tournament { get; set; } = null!;

    public virtual User? Winner { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
