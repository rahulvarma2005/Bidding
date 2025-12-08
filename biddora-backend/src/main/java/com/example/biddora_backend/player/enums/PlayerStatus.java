package com.example.biddora_backend.player.enums;

public enum PlayerStatus {
    UPCOMING,   // Waiting to be auctioned
    ON_AUCTION, // Currently on the table
    SOLD,       // Bought by a team
    UNSOLD      // Passed
}