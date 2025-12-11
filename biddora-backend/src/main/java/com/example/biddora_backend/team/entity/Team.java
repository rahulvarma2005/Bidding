package com.example.biddora_backend.team.entity;

import com.example.biddora_backend.player.entity.Player;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.example.biddora_backend.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "team_name", unique = true)
    private String teamName;

    @Column(name = "acronym", unique = true) // e.g., CSK, MI
    private String acronym;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "total_purse")
    private Long totalPurse; // Initial budget (e.g., 100,000,000)

    @Column(name = "remaining_purse")
    private Long remainingPurse;

    @Column(name = "max_squad_size")
    private Integer maxSquadSize;

    @Column(name = "max_overseas_players")
    private Integer maxOverseasPlayers;

    // Link specific User account to this Team
    @OneToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

    @OneToMany(mappedBy = "soldToTeam", fetch = FetchType.LAZY)
    @JsonManagedReference // This tells Jackson to serialize this side
    private List<Player> squad = new ArrayList<>();

    // Helper method to update purse
    public void deductPurse(Long amount) {
        this.remainingPurse -= amount;
    }
}