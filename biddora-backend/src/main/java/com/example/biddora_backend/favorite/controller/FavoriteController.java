package com.example.biddora_backend.favorite.controller;

import com.example.biddora_backend.favorite.dto.CreateFavoriteDto;
import com.example.biddora_backend.favorite.dto.FavoriteDto;
import com.example.biddora_backend.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<FavoriteDto>> getAllFavorites(){
        return ResponseEntity.ok(favoriteService.getFavorites());
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<Long> countUserFavorites(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(favoriteService.countUserFavorites(userId));
    }

    @PostMapping
    public ResponseEntity<FavoriteDto> addToFavorite(@RequestBody CreateFavoriteDto createFavoriteDto) {
        return ResponseEntity.ok(favoriteService.addToFavorite(createFavoriteDto));
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<String> removeFavorite(@PathVariable("playerId") Long playerId) {
        favoriteService.removeFavorite(playerId);
        return ResponseEntity.ok("Player removed from favorites.");
    }
}