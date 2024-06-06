using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MatchMasterAPI.Models;

public partial class MatchMasterContext : DbContext
{
    public MatchMasterContext()
    {
    }

    public MatchMasterContext(DbContextOptions<MatchMasterContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Match> Matches { get; set; }

    public virtual DbSet<OauthInfo> OauthInfos { get; set; }

    public virtual DbSet<Tournament> Tournaments { get; set; }

    public virtual DbSet<TournamentParticipant> TournamentParticipants { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

                string connectionString = configuration.GetConnectionString("MatchMasterConnection");
                optionsBuilder.UseSqlServer(connectionString);
            }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId).HasName("PK__Matches__4218C817D16E5382");

            entity.HasIndex(e => e.TournamentId, "IX_Matches_TournamentId");

            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.MatchDateTime).HasColumnType("datetime");
            entity.Property(e => e.MatchTitle)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Tournament).WithMany(p => p.Matches)
                .HasForeignKey(d => d.TournamentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Matches__Tournam__403A8C7D");

            entity.HasOne(d => d.Winner).WithMany(p => p.Matches)
                .HasForeignKey(d => d.WinnerId)
                .HasConstraintName("FK__Matches__WinnerI__412EB0B6");

            entity.HasMany(d => d.Users).WithMany(p => p.MatchesNavigation)
                .UsingEntity<Dictionary<string, object>>(
                    "MatchParticipant",
                    r => r.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__MatchPart__UserI__48CFD27E"),
                    l => l.HasOne<Match>().WithMany()
                        .HasForeignKey("MatchId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__MatchPart__Match__47DBAE45"),
                    j =>
                    {
                        j.HasKey("MatchId", "UserId").HasName("PK__MatchPar__936044D329AF777D");
                        j.ToTable("MatchParticipants");
                        j.HasIndex(new[] { "MatchId" }, "IX_MatchParticipants_MatchId");
                    });
        });

        modelBuilder.Entity<OauthInfo>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__OAuthInf__1788CC4C59C6E12D");

            entity.ToTable("OAuthInfos");

            entity.HasIndex(e => e.UserId, "IX_OAuthInfo_UserId");

            entity.Property(e => e.UserId).ValueGeneratedNever();
            entity.Property(e => e.AccessToken)
                .HasMaxLength(1000)
                .IsUnicode(false);
            entity.Property(e => e.AccessTokenExpiration).HasColumnType("datetime");
            entity.Property(e => e.OauthProvider)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("OAuthProvider");
            entity.Property(e => e.OauthProviderId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("OAuthProviderId");
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(1000)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithOne(p => p.OauthInfo)
                .HasForeignKey<OauthInfo>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OAuthInfo__UserI__3A81B327");
        });

        modelBuilder.Entity<Tournament>(entity =>
        {
            entity.HasKey(e => e.TournamentId).HasName("PK__Tourname__AC631313F73AF20E");

            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Creator).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.CreatorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__Creat__3D5E1FD2");
        });

        modelBuilder.Entity<TournamentParticipant>(entity =>
        {
            entity.HasKey(e => e.TournamentParticipantId).HasName("PK__Tourname__1E66AF14FA7F1888");

            entity.HasIndex(e => e.TournamentId, "IX_TournamentParticipants_TournamentId");

            entity.HasIndex(e => e.UserId, "IX_TournamentParticipants_UserId");

            entity.HasOne(d => d.Tournament).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.TournamentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__Tourn__440B1D61");

            entity.HasOne(d => d.User).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__UserI__44FF419A");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CA37C3FE8");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534ED76ACC7").IsUnique();

            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.HashedPassword).HasMaxLength(64);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
