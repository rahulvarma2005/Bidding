package com.example.biddora_backend.bid.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateBidDto {

    @NotNull(message = "Invalid type for player id.")
    private Long playerId; // Renamed from productId

    @NotNull(message = "Set amount.")
    private Long amount;

    // When true, backend will enforce slab-based increments.
    // Custom bids should typically send this as false or omit it.
    private Boolean enforceSlab;
}