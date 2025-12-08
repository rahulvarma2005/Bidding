package com.example.biddora_backend.player.dto;

import com.example.biddora_backend.player.enums.Nationality;
import com.example.biddora_backend.player.enums.PlayerRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreatePlayerDto {

    @NotBlank(message = "Player name is required")
    private String name;

    @NotNull(message = "Nationality is required")
    private Nationality nationality;

    @NotNull(message = "Role is required")
    private PlayerRole role;

    @NotNull(message = "Base price is required")
    private Long basePrice;

    private String stats;
    private String imageUrl;
}