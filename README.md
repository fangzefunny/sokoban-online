# 🎮 Sokoban Web Game

A web-based implementation of the classic Sokoban puzzle game with modern UI and multiple deployment options.

## 🚀 Quick Deploy

**Want to share your game online? Use the deployment script:**

```bash
./deploy.sh
```

Or see [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## ✨ Features

- **Interactive Gameplay**: Use WASD or arrow keys to move the player
- **Multiple Levels**: 9 challenging Sokoban levels included
- **Visual Feedback**: 
  - Player represented as a red circle with a smiley face
  - Boxes are blue squares (turn green when on targets)
  - Targets are orange circles
  - Walls are gray blocks
- **Game Mechanics**:
  - Push boxes onto target positions to win
  - Move counter tracks your progress
  - Reset button to restart current level
  - Win notification when level is completed
- **Responsive Design**: Modern, gradient-based UI with glassmorphism effects
- **No Dependencies**: Pure HTML5, CSS3, and JavaScript

## 🎯 How to Play

### Local Testing
```bash
# Option 1: Python server
python3 -m http.server 8000

# Option 2: Use the deploy script
./deploy.sh
# Then select option 5 for local testing
```

Then open `http://localhost:8000` in your browser.

### Controls
- **WASD** or **Arrow Keys**: Move the player
- **R**: Reset the current level
- **Reset Button**: Reset via UI

### Objective
Push all boxes (blue squares) onto the target positions (orange circles) to complete each level!

## 🌐 Online Deployment Options

### GitHub Pages (FREE)
1. Create GitHub repository
2. Push your code
3. Enable GitHub Pages in settings
4. Game available at `https://username.github.io/repository-name`

### Netlify (RECOMMENDED)
```bash
# Drag & drop deployment
# Or connect GitHub repository
# Instant URL: https://app-name.netlify.app
```

### Vercel
```bash
npm install -g vercel
vercel
# Instant URL: https://app-name.vercel.app
```

### Surge.sh
```bash
npm install -g surge
surge
# Custom URL: https://my-sokoban.surge.sh
```

## 📁 File Structure

```
webgame/
├── index.html          # Main game interface
├── sokoban.js         # Game engine with embedded levels
├── DEPLOYMENT.md      # Detailed deployment guide
├── deploy.sh          # Automated deployment script
├── netlify.toml       # Netlify configuration
├── vercel.json        # Vercel configuration
├── package.json       # NPM configuration
└── levels/            # Level files (for reference)
    ├── prb_1.txt     
    └── ...
```

## 🎨 Game Elements

- **☺** (Red Circle): Player character
- **■** (Blue Square): Box that needs to be pushed
- **⚬** (Orange Circle): Target position for boxes
- **█** (Gray Block): Wall (impassable)
- **■** (Green Square): Box correctly placed on target

## 🔧 Technical Details

### Technologies Used
- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** for game logic (no frameworks!)
- **CSS3** for modern UI styling
- **Progressive Web App** ready

### Browser Compatibility
Works on all modern browsers:
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports touch and keyboard controls

### Performance
- Lightweight: ~15KB total size
- No external dependencies
- 60 FPS smooth animations
- Mobile optimized

## 🤝 Contributing

Want to add more levels or features?

1. **Add Levels**: Edit the `levels` object in `sokoban.js`
2. **Modify Gameplay**: Update the game logic in the `SokobanGame` class
3. **Style Changes**: Edit the CSS in `index.html`

### Level Format
```javascript
'level_name': `######
#.  .#
#    #
# BB #
#&   #
######`
```

Where:
- `#` = Wall
- `.` = Target
- `B` = Box
- `&` = Player
- ` ` = Floor
- `X` = Box on target

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🆘 Need Help?

- 📖 Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- 🚀 Run `./deploy.sh` for guided deployment
- 🌐 Test locally first with `python3 -m http.server 8000`

---

**🎮 Ready to share your Sokoban game with the world!**

Example live URLs after deployment:
- `https://yourusername.github.io/sokoban-game`
- `https://sokoban-game.netlify.app`
- `https://sokoban-game.vercel.app`
