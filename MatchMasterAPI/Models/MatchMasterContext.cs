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
            entity.HasKey(e => e.MatchId).HasName("PK__Matches__4218C8172F35B1DB");

            entity.HasIndex(e => e.TournamentId, "IX_Matches_TournamentId");

            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.MatchStart)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.MatchTitle)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.NextMatchNavigation).WithMany(p => p.InverseNextMatchNavigation)
                .HasForeignKey(d => d.NextMatch)
                .HasConstraintName("FK__Matches__NextMat__7E02B4CC");

            entity.HasOne(d => d.PrevMatchNavigation).WithMany(p => p.InversePrevMatchNavigation)
                .HasForeignKey(d => d.PrevMatch)
                .HasConstraintName("FK__Matches__PrevMat__7EF6D905");

            entity.HasOne(d => d.Tournament).WithMany(p => p.Matches)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("FK__Matches__Tournam__7C1A6C5A");

            entity.HasOne(d => d.Winner).WithMany(p => p.Matches)
                .HasForeignKey(d => d.WinnerId)
                .HasConstraintName("FK__Matches__WinnerI__7D0E9093");
        });

        modelBuilder.Entity<MatchParticipant>(entity =>
        {
            entity.HasKey(e => e.MatchParticipantId).HasName("PK__MatchPar__7BB53638AD9DBBA5");

            entity.HasIndex(e => e.MatchId, "IX_MatchParticipants_MatchId");

            entity.Property(e => e.Score).HasDefaultValue(0);

            entity.HasOne(d => d.Match).WithMany(p => p.MatchParticipants)
                .HasForeignKey(d => d.MatchId)
                .HasConstraintName("FK__MatchPart__Match__0697FACD");

            entity.HasOne(d => d.User).WithMany(p => p.MatchParticipants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MatchPart__UserI__078C1F06");
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
            entity.HasKey(e => e.TournamentId).HasName("PK__Tourname__AC631313DE0AACFC");

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
                .HasConstraintName("FK__Tournamen__Categ__6CD828CA");

            entity.HasOne(d => d.Creator).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.CreatorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__Creat__6BE40491");
        });

        modelBuilder.Entity<TournamentParticipant>(entity =>
        {
            entity.HasKey(e => e.TournamentParticipantId).HasName("PK__Tourname__1E66AF14CFDF11AA");

            entity.HasIndex(e => e.TournamentId, "IX_TournamentParticipants_TournamentId");

            entity.HasIndex(e => e.UserId, "IX_TournamentParticipants_UserId");

            entity.HasOne(d => d.Tournament).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("FK__Tournamen__Tourn__01D345B0");

            entity.HasOne(d => d.User).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Tournamen__UserI__02C769E9");
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
