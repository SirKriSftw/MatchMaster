using System;
using System.Collections.Generic;

namespace MatchMasterAPI.Models;

public partial class Tournament
{
    public int TournamentId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int CreatorId { get; set; }

    public DateTime? TournamentStart { get; set; }

    public virtual User Creator { get; set; } = null!;

    public virtual ICollection<Match> Matches { get; set; } = new List<Match>();

    public virtual ICollection<TournamentParticipant> TournamentParticipants { get; set; } = new List<TournamentParticipant>();
}
