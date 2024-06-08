using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MatchMasterAPI.Models;

public partial class Match
{
    public int MatchId { get; set; }

    public int TournamentId { get; set; }

    public string MatchTitle { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? MatchStart { get; set; }

    public int? WinnerId { get; set; }

    [JsonIgnore]
    public virtual ICollection<MatchParticipant> MatchParticipants { get; set; } = new List<MatchParticipant>();

    [JsonIgnore]
    public virtual Tournament Tournament { get; set; } = null!;

    [JsonIgnore]
    public virtual User? Winner { get; set; }
}
