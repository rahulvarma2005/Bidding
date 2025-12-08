package com.example.biddora_backend.favorite.service.impl;

import com.example.biddora_backend.favorite.dto.CreateFavoriteDto;
import com.example.biddora_backend.favorite.dto.FavoriteDto;
import com.example.biddora_backend.favorite.entity.Favorite;
import com.example.biddora_backend.user.entity.User;
import com.example.biddora_backend.common.exception.ResourceAlreadyExistsException;
import com.example.biddora_backend.common.exception.ResourceNotFoundException;
import com.example.biddora_backend.favorite.mapper.FavoriteMapper;
import com.example.biddora_backend.favorite.repo.FavoriteRepo;
import com.example.biddora_backend.favorite.service.FavoriteService;
import com.example.biddora_backend.common.util.EntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepo favoriteRepo;
    private final FavoriteMapper favoriteMapper;
    private final EntityFetcher entityFetcher;

    @Override
    public List<FavoriteDto> getFavorites() {
        User user = entityFetcher.getCurrentUser();
        return favoriteRepo.findByUserId(user.getId())
                .stream()
                .map(favoriteMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public FavoriteDto addToFavorite(CreateFavoriteDto dto) {
        User user = entityFetcher.getCurrentUser();

        if (favoriteRepo.findByUserIdAndPlayerId(user.getId(), dto.getPlayerId()).isPresent()) {
            throw new ResourceAlreadyExistsException("Player already in favorites.");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setPlayer(entityFetcher.getPlayerById(dto.getPlayerId()));

        return favoriteMapper.mapToDto(favoriteRepo.save(favorite));
    }

    @Override
    public void removeFavorite(Long playerId) {
        User user = entityFetcher.getCurrentUser();
        Favorite favorite = favoriteRepo.findByUserIdAndPlayerId(user.getId(), playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found!"));
        favoriteRepo.delete(favorite);
    }

    @Override
    public Long countUserFavorites(Long userId) {
        return favoriteRepo.countByUserId(userId);
    }
}