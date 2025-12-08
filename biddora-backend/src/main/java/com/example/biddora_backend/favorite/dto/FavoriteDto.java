package com.example.biddora_backend.favorite.dto;

import com.example.biddora_backend.player.dto.PlayerDto;
import com.example.biddora_backend.user.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FavoriteDto {
    private Long id;
    private UserDto user;
    private PlayerDto player; // Ideally rename this to 'player' and update Mapper/Frontend
}