package com.example.biddora_backend.common.handlers;

import com.example.biddora_backend.bid.dto.BidDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SocketConnectionHandler extends TextWebSocketHandler {

    // Maintain a list of all active sessions (Auction Room concept)
    private final List<WebSocketSession> allSessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;

    public SocketConnectionHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        allSessions.add(session);
        System.out.println("Session Connected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Optional: Handle incoming messages from clients (e.g., "Ping" or chat)
        System.out.println("Received: " + message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        allSessions.remove(session);
        System.out.println("Session Disconnected: " + session.getId());
    }

    /**
     * Sends a Bid update to all connected clients.
     * Used by BidServiceImpl.
     */
    public void sendBidToProduct(BidDto mappedBid) throws IOException {
        // We reuse the generic broadcast method to ensure consistent message format
        broadcastMessage("BID_UPDATE", mappedBid);
    }

    /**
     * Generic method to broadcast any event (Bids, Sold, Unsold, New Player).
     * Used by AuctioneerServiceImpl and internally by sendBidToProduct.
     */
    public void broadcastMessage(String type, Object payload) throws IOException {
        WebSocketMessage message = new WebSocketMessage(type, payload);
        String json = objectMapper.writeValueAsString(message);

        for (WebSocketSession session : allSessions) {
            if (session.isOpen()) {
                synchronized (session) { // Prevent concurrent writes to the same session
                    session.sendMessage(new TextMessage(json));
                }
            }
        }
    }

    // Inner record to standardize the JSON structure sent to frontend
    private record WebSocketMessage(String type, Object payload) {}
}