package com.example.biddora_backend.player.mapper;

import com.example.biddora_backend.player.dto.PlayerDto;
import com.example.biddora_backend.player.entity.Player;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PlayerMapper {

    @Mapping(source = "soldToTeam.teamName", target = "soldToTeamName")
    PlayerDto mapToDto(Player player);
}