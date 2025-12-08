import React, { useState, useEffect, useRef } from 'react';
import { FaGavel, FaHistory, FaMoneyBillWave, FaUsers, FaArrowUp } from 'react-icons/fa';

const LiveAuctionRoom = () => {
// ... existing state ...
const [currentPlayer, setCurrentPlayer] = useState(null);
const [currentBid, setCurrentBid] = useState(0);
const [bidHistory, setBidHistory] = useState([]);
const [myTeam, setMyTeam] = useState(null);
const [wsConnected, setWsConnected] = useState(false);
const [message, setMessage] = useState('');
const [customBidAmount, setCustomBidAmount] = useState('');

const ws = useRef(null);
const scrollRef = useRef(null);

// --- CHANGED: WebSocket Connection Logic ---
useEffect(() => {
fetchCurrentPlayer();
fetchMyTeam();

connectWebSocket();

return () => {
    // CLEANUP: Nullify the onclose handler to prevent auto-reconnect loops
    if (ws.current) {
    ws.current.onclose = null; 
    ws.current.close();
    }
};
}, []);

const connectWebSocket = () => {
// Prevent multiple connections
if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

ws.current = new WebSocket('ws://localhost:8081/ws');

ws.current.onopen = () => {
    setWsConnected(true);
    console.log('Connected to Auction Room');
};

ws.current.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleSocketMessage(data);
};

ws.current.onclose = () => {
    setWsConnected(false);
    // Only reconnect if the socket wasn't closed intentionally (handler not null)
    if (ws.current) {
        setTimeout(connectWebSocket, 3000);
    }
};
};

const handleSocketMessage = (data) => {
switch (data.type) {
    case 'BID_UPDATE':
    const newBid = data.payload;
    setCurrentBid(newBid.amount);
    
    // --- CHANGED: Prevent Duplicates ---
    setBidHistory(prev => {
        // Check if bid with this ID already exists
        if (prev.some(bid => bid.id === newBid.id)) {
        return prev;
        }
        return [...prev, newBid];
    });
    break;

    case 'PLAYER_CHANGED':
    setCurrentPlayer(data.payload);
    setCurrentBid(data.payload.basePrice);
    setBidHistory([]);
    setMessage(''); 
    setCustomBidAmount('');
    fetchMyTeam();
    break;

    // ... rest of the cases (PLAYER_SOLD, PLAYER_UNSOLD) remain the same ...
    case 'PLAYER_SOLD':
    setCurrentPlayer(prev => ({ ...prev, status: 'SOLD', soldPrice: data.payload.soldPrice, soldToTeamName: data.payload.soldToTeamName }));
    setMessage(`SOLD TO ${data.payload.soldToTeamName} for ₹${data.payload.soldPrice.toLocaleString()}`);
    fetchMyTeam();
    break;
    
    case 'PLAYER_UNSOLD':
    setCurrentPlayer(prev => ({ ...prev, status: 'UNSOLD' }));
    setMessage('PLAYER UNSOLD');
    break;

    default:
    break;
}
};

// ... rest of the component (fetchCurrentPlayer, fetchMyTeam, placeBid, render) ...
// (No changes needed below this point, just keep your existing code)

const fetchCurrentPlayer = async () => {
// ... existing code ...
try {
    const res = await fetch('http://localhost:8081/api/players/all?status=ON_AUCTION');
    const data = await res.json();
    if (data.content && data.content.length > 0) {
    const player = data.content[0];
    setCurrentPlayer(player);
    
    // Fetch current bids for this player to get the latest state
    await fetchBidsForPlayer(player.id, player.basePrice);
    }
} catch (err) {
    console.error(err);
}
};

// NEW: Fetch existing bids when joining the auction
const fetchBidsForPlayer = async (playerId, basePrice) => {
  try {
    const res = await fetch(`http://localhost:8081/api/bid/player/${playerId}?page=0`);
    if (res.ok) {
      const data = await res.json();
      const bids = data.content || [];
      
      if (bids.length > 0) {
        // Bids come sorted by amount DESC (highest first)
        // Set current bid to the highest bid (first item)
        setCurrentBid(bids[0].amount);
        // Reverse to show in chronological order (oldest/lowest first) for bid history
        setBidHistory(bids.reverse());
      } else {
        // No bids yet, use base price
        setCurrentBid(basePrice);
        setBidHistory([]);
      }
    }
  } catch (err) {
    console.error("Failed to fetch bids:", err);
    setCurrentBid(basePrice);
  }
};

const fetchMyTeam = async () => {
// ... existing code ...
try {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:8081/api/teams/my-team', {
    headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
    const team = await res.json();
    setMyTeam(team);
    }
} catch (err) {
    console.error(err);
}
};

const sendBidToBackend = async (amount) => {
    // ... existing code ...
    if (!myTeam) {
    alert("You must be logged in as a Team Owner to bid.");
    return;
}

if (myTeam.remainingPurse < amount) {
    alert(`Insufficient Funds! You need ₹${amount.toLocaleString()} but have ₹${myTeam.remainingPurse.toLocaleString()}`);
    return;
}

try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8081/api/bid', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        playerId: currentPlayer.id,
        amount: amount
    })
    });

    if (!res.ok) {
    const err = await res.json();
    alert(err.message || "Bid Failed");
    } else {
    setCustomBidAmount('');
    }
} catch (err) {
    console.error(err);
    alert("Network Error: Could not place bid.");
}
};

const handleQuickBid = () => {
if (!currentPlayer) return;
let increment = 500000; 
if (currentBid >= 10000000) increment = 2000000; 
const nextBidAmount = currentBid + increment;
sendBidToBackend(nextBidAmount);
};

const handleCustomBid = (e) => {
e.preventDefault();
if (!customBidAmount) return;
const bidAmount = parseInt(customBidAmount.replace(/,/g, ''), 10);
if (isNaN(bidAmount)) {
    alert("Please enter a valid number");
    return;
}
if (bidAmount <= currentBid) {
    alert(`Bid must be higher than current price: ₹${currentBid.toLocaleString()}`);
    return;
}
sendBidToBackend(bidAmount);
};

// ... Render Return Statement (Copy your existing return) ...
if (!currentPlayer) {
return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
    <div className="text-center">
        <FaGavel className="w-20 h-20 mx-auto text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold">Waiting for Auctioneer...</h2>
        <p className="text-gray-400 mt-2">No player is currently on the table.</p>
    </div>
    </div>
);
}

return (
<div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
    <div className="lg:w-2/3 p-6 flex flex-col">
    <div className={`mb-4 text-xs font-bold flex items-center ${wsConnected ? 'text-green-600' : 'text-red-600'}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${wsConnected ? 'bg-green-600' : 'bg-red-600'}`}></div>
        {wsConnected ? 'LIVE CONNECTED' : 'DISCONNECTED'}
    </div>

    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex-grow relative flex flex-col">
        {message && (
        <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center backdrop-blur-sm">
            <h1 className="text-4xl md:text-5xl font-black text-white text-center tracking-tighter animate-bounce px-4">
            {message}
            </h1>
        </div>
        )}

        <div className="flex-grow bg-gradient-to-br from-blue-900 to-purple-900 relative flex flex-col items-center justify-center p-8">
        <img 
            src={currentPlayer.imageUrl || "https://via.placeholder.com/400"} 
            alt={currentPlayer.name}
            className="h-48 w-48 md:h-64 md:w-64 rounded-full border-8 border-white/20 object-cover shadow-2xl mb-6"
        />
        <div className="text-center text-white z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{currentPlayer.name}</h1>
            <div className="flex justify-center items-center space-x-4 text-blue-200">
            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold">{currentPlayer.role}</span>
            <span className="flex items-center"><FaUsers className="mr-2"/> {currentPlayer.nationality}</span>
            </div>
        </div>
        </div>

        <div className="p-6 md:p-8 bg-white border-t border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Current Price</p>
            <p className="text-4xl md:text-5xl font-mono font-bold text-gray-800">
                ₹{currentBid.toLocaleString()}
            </p>
            </div>

            {currentPlayer.status === 'ON_AUCTION' && (
            <div className="flex flex-col gap-3 w-full md:w-auto">
                <button 
                onClick={handleQuickBid}
                disabled={!myTeam}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                <FaGavel className="mr-2" /> RAISE BID
                </button>

                <form onSubmit={handleCustomBid} className="flex items-center gap-2">
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input 
                    type="number"
                    value={customBidAmount}
                    onChange={(e) => setCustomBidAmount(e.target.value)}
                    placeholder="Custom Amount"
                    className="w-full pl-7 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 font-mono font-bold"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!myTeam || !customBidAmount}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    <FaArrowUp />
                </button>
                </form>
                {!myTeam && <p className="text-xs text-red-500 text-center font-semibold">Login as Owner to Bid</p>}
            </div>
            )}
        </div>
        </div>
    </div>
    </div>

    <div className="lg:w-1/3 bg-white border-l border-gray-200 p-6 flex flex-col h-screen sticky top-0 overflow-hidden">
    {myTeam ? (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center">
            {myTeam.logoUrl && <img src={myTeam.logoUrl} alt="Logo" className="w-6 h-6 mr-2 rounded"/>}
            {myTeam.teamName}
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">{myTeam.acronym}</span>
        </div>
        
        <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center"><FaMoneyBillWave className="mr-2"/> Purse</span>
            <span className="font-mono font-bold text-green-600">₹{myTeam.remainingPurse.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(myTeam.remainingPurse / myTeam.totalPurse) * 100}%` }}
            ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 pt-2">
            <span>Squad: {myTeam.squad ? myTeam.squad.length : 0}/25</span>
            <span>Overseas: {myTeam.squad ? myTeam.squad.filter(p => p.nationality === 'OVERSEAS').length : 0}/8</span>
            </div>
        </div>
        </div>
    ) : (
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6 text-sm text-yellow-800 flex-shrink-0">
            Log in as a Team Owner to view wallet and place bids.
        </div>
    )}

    <div className="flex-grow flex flex-col overflow-hidden">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center flex-shrink-0">
        <FaHistory className="mr-2"/> Live Activity
        </h3>
        
        <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {bidHistory.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No bids yet. Start the action!</p>
            ) : (
            bidHistory.map((bid, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in-up">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs mr-3">
                    {bid.bidderUsername ? bid.bidderUsername.substring(0,2).toUpperCase() : "U"}
                    </div>
                    <div>
                    <p className="text-sm font-bold text-gray-800">{bid.bidderUsername}</p>
                    <p className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                    </div>
                </div>
                <span className="font-mono font-bold text-gray-700">₹{bid.amount.toLocaleString()}</span>
                </div>
            ))
            )}
        </div>
    </div>
    </div>
</div>
);
};

export default LiveAuctionRoom;