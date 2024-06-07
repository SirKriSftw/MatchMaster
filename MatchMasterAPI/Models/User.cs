using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MatchMasterAPI.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? Username { get; set; }

    public string Email { get; set; } = null!;

    public byte[]? HashedPassword { get; set; }

    public byte[]? Salt { get; set; }

    public virtual ICollection<Match> Matches { get; set; } = new List<Match>();

    public virtual OauthInfo? OauthInfo { get; set; }

    public virtual ICollection<TournamentParticipant> TournamentParticipants { get; set; } = new List<TournamentParticipant>();

    [JsonIgnore]
    public virtual ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();

    public virtual ICollection<Match> MatchesNavigation { get; set; } = new List<Match>();
}
