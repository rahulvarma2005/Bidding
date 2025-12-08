package com.example.biddora_backend.bid.controller;

import com.example.biddora_backend.bid.dto.BidDto;
import com.example.biddora_backend.bid.dto.CreateBidDto;
import com.example.biddora_backend.bid.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/bid")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping
    public ResponseEntity<BidDto> placeBid(@Valid @RequestBody CreateBidDto createBidDto) {
        return ResponseEntity.ok(bidService.placeBid(createBidDto));
    }

    // Updated path from /product/{productId} to /player/{playerId}
    @GetMapping("/player/{playerId}")
    public ResponseEntity<Page<BidDto>> getBidsForPlayer(@PathVariable Long playerId,
                                                         @RequestParam Optional<Integer> page) {
        // Note: Ensure BidService method is updated to accept playerId
        return ResponseEntity.ok(bidService.getBidsByProductId(playerId, page));
    }
}