using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MatchMasterAPI.Models;

public partial class MatchParticipant
{
    public int MatchParticipantId { get; set; }

    public int MatchId { get; set; }

    public int UserId { get; set; }

    [JsonIgnore]
    public virtual Match Match { get; set; } = null!;

    [JsonIgnore]
    public virtual User User { get; set; } = null!;
}
