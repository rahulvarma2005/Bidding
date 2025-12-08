package com.example.biddora_backend.player.entity;

import com.example.biddora_backend.player.enums.Nationality;
import com.example.biddora_backend.player.enums.PlayerRole;
import com.example.biddora_backend.player.enums.PlayerStatus;
import com.example.biddora_backend.team.entity.Team;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "nationality")
    private Nationality nationality;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private PlayerRole role;

    @Column(name = "base_price")
    private Long basePrice;

    @Column(name = "sold_price")
    private Long soldPrice;

    // Optional: Store stats as a JSON string or simple text (e.g., "Matches: 50, Runs: 1200")
    @Column(name = "stats")
    private String stats;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PlayerStatus status;

    @ManyToOne
    @JoinColumn(name = "sold_to_team_id")
    @JsonBackReference // This tells Jackson NOT to serialize this side (prevents loop)
    private Team soldToTeam;

    // Provide a default image if none is uploaded
    @Column(name = "image_url")
    private String imageUrl;
}