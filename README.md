# Portfolio with Online Carrom Game

This is a [Next.js](https://nextjs.org) portfolio project featuring a fully functional online multiplayer carrom game.

## Features

- **Portfolio Website**: Personal portfolio with projects, experience, and contact information
- **Online Carrom Game**: Real-time multiplayer carrom board game with:
  - Room-based matchmaking
  - Real-time synchronization
  - Turn-based gameplay
  - Physics-based ball movement
  - Responsive design

## Game Features

- Create or join rooms with unique IDs
- Real-time multiplayer gameplay
- Physics simulation for realistic ball movement
- Score tracking and win conditions
- Disconnect handling

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm run server
```

3. In another terminal, start the frontend:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the portfolio
5. Navigate to `/game` to play the carrom game

## Deployment

### Backend (Railway)

1. Go to [Railway.app](https://railway.app) and create an account
2. Connect your GitHub repository
3. Deploy the `backend/` directory as a separate service
4. Note the deployed URL (e.g., `https://your-backend.railway.app`)

### Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com) and create an account
2. Connect your GitHub repository
3. Add environment variable: `NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app`
4. Deploy the project

## Game Rules

- Players take turns shooting the striker
- Pocket all coins and the queen to win
- Striker going into pocket gives 5 points to opponent
- Queen gives 3 points, regular coins give 1 point each
- First to reach winning conditions wins

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Socket.io, Express
- **Real-time Communication**: Socket.io
- **Physics**: Custom physics engine
- **Deployment**: Vercel (frontend), Railway (backend)

## Project Structure

```
├── app/
│   ├── game/          # Carrom game components
│   │   ├── page.tsx   # Main game page
│   │   ├── Lobby.tsx  # Room creation/joining
│   │   ├── GameBoard.tsx
│   │   ├── GameUI.tsx
│   │   └── ...        # Game logic files
│   └── ...            # Portfolio pages
├── backend/
│   └── server.js      # Socket.io server
└── public/            # Static assets
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
