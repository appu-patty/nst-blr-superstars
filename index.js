const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to all routes
app.use(limiter);

// Middleware to serve static files
app.use(express.static('public'));

// Common CSS color names mapped to hex codes
const CSS_COLOR_NAMES = {
  'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4',
  'azure': '#f0ffff', 'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000',
  'blanchedalmond': '#ffebcd', 'blue': '#0000ff', 'blueviolet': '#8a2be2', 'brown': '#a52a2a',
  'burlywood': '#deb887', 'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e',
  'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c',
  'cyan': '#00ffff', 'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b',
  'darkgray': '#a9a9a9', 'darkgrey': '#a9a9a9', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b',
  'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f', 'darkorange': '#ff8c00', 'darkorchid': '#9932cc',
  'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b',
  'darkslategray': '#2f4f4f', 'darkslategrey': '#2f4f4f', 'darkturquoise': '#00ced1', 'darkviolet': '#9400d3',
  'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dimgrey': '#696969',
  'dodgerblue': '#1e90ff', 'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22',
  'fuchsia': '#ff00ff', 'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700',
  'goldenrod': '#daa520', 'gray': '#808080', 'grey': '#808080', 'green': '#008000',
  'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred': '#cd5c5c',
  'indigo': '#4b0082', 'ivory': '#fffff0', 'khaki': '#f0e68c', 'lavender': '#e6e6fa',
  'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd', 'lightblue': '#add8e6',
  'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2', 'lightgray': '#d3d3d3',
  'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a',
  'lightseagreen': '#20b2aa', 'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightslategrey': '#778899',
  'lightsteelblue': '#b0c4de', 'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32',
  'linen': '#faf0e6', 'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa',
  'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3', 'mediumpurple': '#9370db', 'mediumseagreen': '#3cb371',
  'mediumslateblue': '#7b68ee', 'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585',
  'midnightblue': '#191970', 'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5',
  'navajowhite': '#ffdead', 'navy': '#000080', 'oldlace': '#fdf5e6', 'olive': '#808000',
  'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6',
  'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#db7093',
  'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb',
  'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080', 'rebeccapurple': '#663399',
  'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1', 'saddlebrown': '#8b4513',
  'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57', 'seashell': '#fff5ee',
  'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd',
  'slategray': '#708090', 'slategrey': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f',
  'steelblue': '#4682b4', 'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8',
  'tomato': '#ff6347', 'turquoise': '#40e0d0', 'violet': '#ee82ee', 'wheat': '#f5deb3',
  'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00', 'yellowgreen': '#9acd32'
};

// Utility function to normalize color to hex code
function normalizeColor(color) {
  if (!color) return '#f5f5f5';
  
  // If it's already a hex code, return it
  if (color.startsWith('#')) {
    return color;
  }
  
  // Convert color name to lowercase and look it up
  const colorLower = color.toLowerCase().trim();
  return CSS_COLOR_NAMES[colorLower] || color;
}

// Utility function to calculate contrast and determine text color
function getContrastColor(color) {
  // Normalize color to hex
  let hexColor = normalizeColor(color);
  
  // Default to white if no color provided
  if (!hexColor) return '#ffffff';
  
  // Remove # if present
  hexColor = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate relative luminance using WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Route 1: GET / - Displays HTML with list of files
app.get('/', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  
  fs.readdir(dataDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading data directory');
    }
    
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    const usernames = jsonFiles.map(file => file.replace('.json', ''));
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NST BLR Superstars</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          h1 {
            color: #333;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            background-color: white;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>NST BLR Superstars</h1>
        <h2>User List</h2>
        <ul>
          ${usernames.map(username => `
            <li><a href="/${username}">${username}</a></li>
          `).join('')}
        </ul>
      </body>
      </html>
    `;
    
    res.send(html);
  });
});

// Route 2: GET /api/users - Lists all the files in data in a JSON array
app.get('/api/users', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  
  fs.readdir(dataDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading data directory' });
    }
    
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    const usernames = jsonFiles.map(file => file.replace('.json', ''));
    
    res.json(usernames);
  });
});

// Route 4: GET /api/users/:username - Fetch JSON file for user
app.get('/api/users/:username', (req, res) => {
  const username = req.params.username;
  const filePath = path.join(__dirname, 'data', `${username}.json`);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(500).json({ error: 'Error reading user file' });
    }
    
    try {
      const userData = JSON.parse(data);
      res.json(userData);
    } catch (parseErr) {
      res.status(500).json({ error: 'Error parsing user data' });
    }
  });
});

// Route 3: GET /:username - Display HTML with user information
app.get('/:username', (req, res) => {
  const username = req.params.username;
  const filePath = path.join(__dirname, 'data', `${username}.json`);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Not Found</title>
          </head>
          <body>
            <h1>User Not Found</h1>
            <p>The user "${username}" does not exist.</p>
            <a href="/">Back to user list</a>
          </body>
          </html>
        `);
      }
      return res.status(500).send('Error reading user file');
    }
    
    try {
      const userData = JSON.parse(data);
      
      // Get customization options or use defaults
      const customization = userData.customization || {};
      const backgroundColor = normalizeColor(customization.backgroundColor || '#f5f5f5');
      const backgroundImage = customization.backgroundImage || '';
      const profileImage = customization.profileImage || '';
      const textColor = getContrastColor(backgroundColor);
      
      // Build background style
      let backgroundStyle = `background-color: ${backgroundColor};`;
      if (backgroundImage) {
        backgroundStyle += ` background-image: url('${backgroundImage}'); background-size: cover; background-position: center; background-attachment: fixed;`;
      }
      
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${userData.name || username}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              ${backgroundStyle}
              color: ${textColor};
              min-height: 100vh;
            }
            .profile-card {
              background-color: rgba(255, 255, 255, 0.95);
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              color: #333;
            }
            .profile-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .profile-image {
              width: 150px;
              height: 150px;
              border-radius: 50%;
              object-fit: cover;
              margin-bottom: 20px;
              border: 4px solid #fff;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
              margin-top: 0;
            }
            .profile-field {
              margin: 15px 0;
            }
            .profile-label {
              font-weight: bold;
              color: #666;
            }
            .back-link {
              display: inline-block;
              margin-top: 20px;
              color: #007bff;
              text-decoration: none;
              font-weight: bold;
            }
            .back-link:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="profile-card">
            <div class="profile-header">
              ${profileImage ? `<img src="${profileImage}" alt="${userData.name || username}" class="profile-image">` : ''}
              <h1>${userData.name || username}</h1>
            </div>
            ${userData.username ? `<div class="profile-field"><span class="profile-label">Username:</span> ${userData.username}</div>` : ''}
            ${userData.email ? `<div class="profile-field"><span class="profile-label">Email:</span> ${userData.email}</div>` : ''}
            ${userData.bio ? `<div class="profile-field"><span class="profile-label">Bio:</span> ${userData.bio}</div>` : ''}
            ${userData.location ? `<div class="profile-field"><span class="profile-label">Location:</span> ${userData.location}</div>` : ''}
            ${userData.favoriteColor ? `<div class="profile-field"><span class="profile-label">Favorite Color:</span> ${userData.favoriteColor}</div>` : ''}
            ${userData.favoriteGame ? `<div class="profile-field"><span class="profile-label">Favorite Game:</span> ${userData.favoriteGame}</div>` : ''}
            ${userData.hobbies ? `<div class="profile-field"><span class="profile-label">Hobbies:</span> ${userData.hobbies}</div>` : ''}
            ${userData.superpower ? `<div class="profile-field"><span class="profile-label">Superpower I Wish I Had:</span> ${userData.superpower}</div>` : ''}
            ${userData.favoriteSnack ? `<div class="profile-field"><span class="profile-label">Favorite Snack:</span> ${userData.favoriteSnack}</div>` : ''}
            ${userData.funFact ? `<div class="profile-field"><span class="profile-label">Fun Fact:</span> ${userData.funFact}</div>` : ''}
            <a href="/" class="back-link">← Back to user list</a>
          </div>
        </body>
        </html>
      `;
      
      res.send(html);
    } catch (parseErr) {
      res.status(500).send('Error parsing user data');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
