using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MatchMasterAPI.Models;

public partial class TournamentParticipant
{
    public int TournamentParticipantId { get; set; }

    public int TournamentId { get; set; }

    public int UserId { get; set; }

    [JsonIgnore]
    public virtual Tournament Tournament { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
