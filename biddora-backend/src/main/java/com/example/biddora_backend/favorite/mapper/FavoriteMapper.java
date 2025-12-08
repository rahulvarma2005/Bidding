package com.example.biddora_backend.favorite.mapper;

import com.example.biddora_backend.favorite.dto.FavoriteDto;
import com.example.biddora_backend.favorite.entity.Favorite;
import com.example.biddora_backend.player.mapper.PlayerMapper;
import com.example.biddora_backend.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, PlayerMapper.class})
public interface FavoriteMapper {

    FavoriteDto mapToDto(Favorite favorite);
}