using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MatchMasterAPI.Models;

public partial class OauthInfo
{
    public int UserId { get; set; }

    public string? OauthProvider { get; set; }

    public string? OauthProviderId { get; set; }

    public string? AccessToken { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? AccessTokenExpiration { get; set; }

    [JsonIgnore]
    public virtual User User { get; set; } = null!;
}
