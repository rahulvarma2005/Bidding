package com.example.biddora_backend.player.dto;

import com.example.biddora_backend.player.enums.Nationality;
import com.example.biddora_backend.player.enums.PlayerRole;
import com.example.biddora_backend.player.enums.PlayerStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PlayerDto {
    private Long id;
    private String name;
    private Nationality nationality;
    private PlayerRole role;
    private Long basePrice;
    private Long soldPrice;
    private PlayerStatus status;
    private String stats;
    private String imageUrl;
    private String soldToTeamName; // Name of the team that bought the player
}