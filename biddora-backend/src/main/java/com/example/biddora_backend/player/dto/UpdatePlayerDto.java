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
public class UpdatePlayerDto {
    private String name;
    private Nationality nationality;
    private PlayerRole role;
    private Long basePrice;
    private String stats;
    private String imageUrl;
    private PlayerStatus status;
}
