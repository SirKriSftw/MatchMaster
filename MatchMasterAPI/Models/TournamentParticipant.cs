using System;
using System.Collections.Generic;

namespace MatchMasterAPI.Models;

public partial class TournamentParticipant
{
    public int TournamentParticipantId { get; set; }

    public int TournamentId { get; set; }

    public int UserId { get; set; }

    public virtual Tournament Tournament { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
