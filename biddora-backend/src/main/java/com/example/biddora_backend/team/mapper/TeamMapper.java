package com.example.biddora_backend.team.mapper;

import com.example.biddora_backend.player.mapper.PlayerMapper;
import com.example.biddora_backend.team.dto.TeamDto;
import com.example.biddora_backend.team.entity.Team;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PlayerMapper.class})
public interface TeamMapper {

    @Mapping(source = "owner.username", target = "ownerUsername")
    @Mapping(source = "squad", target = "squad")
    TeamDto mapToDto(Team team);
}