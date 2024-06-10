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
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A0BAA24167B");

            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId).HasName("PK__Matches__4218C817D1DB306D");

            entity.HasIndex(e => e.TournamentId, "IX_Matches_TournamentId");

            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.MatchStart).HasColumnType("datetime");
            entity.Property(e => e.MatchTitle)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.NextMatchNavigation).WithMany(p => p.InverseNextMatchNavigation)
                .HasForeignKey(d => d.NextMatch)
                .HasConstraintName("FK__Matches__NextMat__5224328E");

            entity.HasOne(d => d.Tournament).WithMany(p => p.Matches)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("FK__Matches__Tournam__503BEA1C");

            entity.HasOne(d => d.Winner).WithMany(p => p.Matches)
                .HasForeignKey(d => d.WinnerId)
                .HasConstraintName("FK__Matches__WinnerI__51300E55");
        });

        modelBuilder.Entity<MatchParticipant>(entity =>
        {
            entity.HasKey(e => e.MatchParticipantId).HasName("PK__MatchPar__7BB536385502EABD");

            entity.HasIndex(e => e.MatchId, "IX_MatchParticipants_MatchId");

            entity.HasOne(d => d.Match).WithMany(p => p.MatchParticipants)
                .HasForeignKey(d => d.MatchId)
                .HasConstraintName("FK__MatchPart__Match__58D1301D");

            entity.HasOne(d => d.User).WithMany(p => p.MatchParticipants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MatchPart__UserI__59C55456");
        });

        modelBuilder.Entity<OauthInfo>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__OAuthInf__1788CC4C23F55454");

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
                .HasConstraintName("FK__OAuthInfo__UserI__45BE5BA9");
        });

        modelBuilder.Entity<Tournament>(entity =>
        {
            entity.HasKey(e => e.TournamentId).HasName("PK__Tourname__AC631313F49CAD5D");

            entity.HasIndex(e => e.CategoryId, "IX_Tournaments_CategoryId");

            entity.HasIndex(e => e.Title, "IX_Tournaments_Title");

            entity.Property(e => e.AcceptingParticipants).HasDefaultValue(true);
            entity.Property(e => e.CategoryId).HasDefaultValue(1);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.TournamentStart).HasColumnType("datetime");

            entity.HasOne(d => d.Category).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__Tournamen__Categ__4D5F7D71");

            entity.HasOne(d => d.Creator).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.CreatorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__Creat__4C6B5938");
        });

        modelBuilder.Entity<TournamentParticipant>(entity =>
        {
            entity.HasKey(e => e.TournamentParticipantId).HasName("PK__Tourname__1E66AF1465974B75");

            entity.HasIndex(e => e.TournamentId, "IX_TournamentParticipants_TournamentId");

            entity.HasIndex(e => e.UserId, "IX_TournamentParticipants_UserId");

            entity.HasOne(d => d.Tournament).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("FK__Tournamen__Tourn__55009F39");

            entity.HasOne(d => d.User).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__UserI__55F4C372");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CC1244437");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534ECA07BB0").IsUnique();

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
