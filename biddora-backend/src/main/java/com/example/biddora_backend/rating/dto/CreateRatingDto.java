package com.example.biddora_backend.rating.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateRatingDto {
    private Long playerId;
    private String comment;
    @NotNull
    private Integer ratingStars;
}