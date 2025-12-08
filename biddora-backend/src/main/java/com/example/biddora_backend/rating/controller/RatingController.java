package com.example.biddora_backend.rating.controller;

import com.example.biddora_backend.rating.dto.CreateRatingDto;
import com.example.biddora_backend.rating.dto.RatingDto;
import com.example.biddora_backend.rating.dto.UpdateRatingDto;
import com.example.biddora_backend.rating.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingDto> createRating(@RequestBody CreateRatingDto createRatingDto) {
        return ResponseEntity.ok(ratingService.createRating(createRatingDto));
    }

    @GetMapping("/{ratingId}")
    public ResponseEntity<RatingDto> getById(@PathVariable Long ratingId){
        return ResponseEntity.ok(ratingService.getById(ratingId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingDto>> getRatingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingsByUserId(userId));
    }

    // Updated: Changed from /product/{productId} to /player/{playerId}
    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<RatingDto>> getPlayerRatings(@PathVariable("playerId") Long playerId){
        return ResponseEntity.ok(ratingService.getPlayerRatings(playerId));
    }

    @PutMapping("/{ratingId}")
    public ResponseEntity<RatingDto> updateRating(@PathVariable Long ratingId,
                                                  @RequestBody UpdateRatingDto updateRatingDto) {
        return ResponseEntity.ok(ratingService.updateRating(ratingId, updateRatingDto));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}