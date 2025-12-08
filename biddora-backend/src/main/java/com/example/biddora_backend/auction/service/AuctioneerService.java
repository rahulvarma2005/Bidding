package com.example.biddora_backend.auction.service;

import com.example.biddora_backend.player.dto.PlayerDto;

public interface AuctioneerService {
    PlayerDto bringPlayerToTable(Long playerId);
    PlayerDto sellPlayer(Long playerId);
    PlayerDto markUnsold(Long playerId);
}