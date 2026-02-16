# 🐍 Snakes and Ladders - Interactive Game

A colorful and interactive local multiplayer Snakes and Ladders game with sound effects and animations.

## Features

### 🎮 Gameplay
- **Local Multiplayer**: Support for 2-6 players
- **Classic Board**: 10x10 grid (100 squares) with traditional snake pattern
- **Snakes & Ladders**: 10 snakes and 10 ladders strategically placed
- **Turn-based**: Players take turns rolling dice and moving

### 🎨 Visual Features
- **Colorful Design**: Modern gradient UI with vibrant colors
- **Animated Dice**: Rolling animation with emoji dice
- **Player Tokens**: Color-coded tokens that move smoothly across the board
- **Event Animations**: 
  - 🐍 Snake animations when sliding down
  - 🪜 Ladder animations when climbing up
  - 🎉 Winner celebration screen
- **Visual Cues**: 
  - Special cells highlighted (snakes in red, ladders in green)
  - Active player highlighted in sidebar
  - Smooth transitions and hover effects

### 🔊 Sound Effects
- **Dice Roll**: Sound when rolling the dice
- **Player Movement**: Sound for each movement step
- **Snake**: Descending tone when hitting a snake
- **Ladder**: Ascending tone when climbing a ladder
- **Win**: Celebration melody when a player wins

### 📱 Responsive Design
- Works on desktop and tablet devices
- Adaptive layout for different screen sizes

## How to Play

1. **Start the Game**: Open `index.html` in a modern web browser
2. **Add Players**: Click "Add Player" to add players (minimum 2, maximum 6)
3. **Roll Dice**: Click "Roll Dice" button to roll and move
4. **Move**: Your token will automatically move the number of spaces rolled
5. **Snakes & Ladders**: 
   - Landing on a snake's head slides you down
   - Landing on a ladder's base climbs you up
6. **Win**: First player to reach square 100 wins!

## Game Rules

- Players start at position 0 (off the board)
- Roll the dice to determine how many spaces to move
- If you land on a snake's head, slide down to the snake's tail
- If you land on a ladder's base, climb up to the ladder's top
- You must roll the exact number to reach square 100 to win
- If you roll more than needed, you stay in place

## Technical Details

- **Pure JavaScript**: No external dependencies
- **Web Audio API**: For sound effects
- **CSS Animations**: For smooth visual effects
- **Local Storage**: Game state managed in memory

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note**: Sound effects require Web Audio API support. Some browsers may require user interaction before playing sounds.

## Customization

You can customize the game by modifying:
- `SNAKES` and `LADDERS` objects in `script.js` to change board layout
- `PLAYER_COLORS` array to change player token colors
- CSS variables in `style.css` to change color scheme
- Sound frequencies in `createSounds()` function to adjust audio

## License

Free to use and modify for personal or educational purposes.

Enjoy playing! 🎲
