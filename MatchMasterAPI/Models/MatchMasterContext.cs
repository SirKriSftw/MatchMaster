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

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Match> Matches { get; set; }

    public virtual DbSet<MatchParticipant> MatchParticipants { get; set; }

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
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A0B189221ED");

            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId).HasName("PK__Matches__4218C817587D7431");

            entity.ToTable(tb => tb.HasTrigger("UpdateMatchesOnDelete"));

            entity.HasIndex(e => e.StartingMatch, "IX_Matches_StartingMatch");

            entity.Property(e => e.MatchStart)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.MatchTitle)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.StartingMatch).HasDefaultValue(true);

            entity.HasOne(d => d.LoseMatchNavigation).WithMany(p => p.InverseLoseMatchNavigation)
                .HasForeignKey(d => d.LoseMatch)
                .HasConstraintName("FK__Matches__LoseMat__27F8EE98");

            entity.HasOne(d => d.Tournament).WithMany(p => p.Matches)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("FK__Matches__Tournam__251C81ED");

            entity.HasOne(d => d.WinMatchNavigation).WithMany(p => p.InverseWinMatchNavigation)
                .HasForeignKey(d => d.WinMatch)
                .HasConstraintName("FK__Matches__WinMatc__2704CA5F");

            entity.HasOne(d => d.Winner).WithMany(p => p.Matches)
                .HasForeignKey(d => d.WinnerId)
                .HasConstraintName("FK__Matches__WinnerI__2610A626");
        });

        modelBuilder.Entity<MatchParticipant>(entity =>
        {
            entity.HasKey(e => e.MatchParticipantId).HasName("PK__MatchPar__7BB5363837C3BA00");

            entity.Property(e => e.Score).HasDefaultValue(0);

            entity.HasOne(d => d.Match).WithMany(p => p.MatchParticipants)
                .HasForeignKey(d => d.MatchId)
                .HasConstraintName("FK__MatchPart__Match__2F9A1060");

            entity.HasOne(d => d.User).WithMany(p => p.MatchParticipants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MatchPart__UserI__308E3499");
        });

        modelBuilder.Entity<OauthInfo>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__OAuthInf__1788CC4CBB603047");

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
                .HasConstraintName("FK__OAuthInfo__UserI__65370702");
        });

        modelBuilder.Entity<Tournament>(entity =>
        {
            entity.HasKey(e => e.TournamentId).HasName("PK__Tourname__AC631313EA22C7DC");

            entity.Property(e => e.AcceptingParticipants).HasDefaultValue(true);
            entity.Property(e => e.CategoryId).HasDefaultValue(1);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.TournamentStart).HasColumnType("datetime");

            entity.HasOne(d => d.Category).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__Tournamen__Categ__2057CCD0");

            entity.HasOne(d => d.Creator).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.CreatorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__Creat__1F63A897");
        });

        modelBuilder.Entity<TournamentParticipant>(entity =>
        {
            entity.HasKey(e => e.TournamentParticipantId).HasName("PK__Tourname__1E66AF14EACE8D30");

            entity.HasOne(d => d.Tournament).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("FK__Tournamen__Tourn__2AD55B43");

            entity.HasOne(d => d.User).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__UserI__2BC97F7C");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C4D52741E");

            entity.HasIndex(e => e.Email, "IX_Users_Email");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534C678274D").IsUnique();

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
