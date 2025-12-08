package com.example.biddora_backend.auction.controller;

import com.example.biddora_backend.auction.service.AuctioneerService;
import com.example.biddora_backend.player.dto.PlayerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auctioneer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Strict Security at controller level
public class AuctioneerController {

    private final AuctioneerService auctioneerService;

    @PostMapping("/start/{playerId}")
    public ResponseEntity<PlayerDto> startAuction(@PathVariable Long playerId) {
        return ResponseEntity.ok(auctioneerService.bringPlayerToTable(playerId));
    }

    @PostMapping("/sold/{playerId}")
    public ResponseEntity<PlayerDto> markSold(@PathVariable Long playerId) {
        return ResponseEntity.ok(auctioneerService.sellPlayer(playerId));
    }

    @PostMapping("/unsold/{playerId}")
    public ResponseEntity<PlayerDto> markUnsold(@PathVariable Long playerId) {
        return ResponseEntity.ok(auctioneerService.markUnsold(playerId));
    }
}