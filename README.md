# NST BLR Superstars API

A simple Express.js API to manage and display user profiles for Newton School Bangalore Superstars.

## Features

- View list of all users
- View individual user profiles
- JSON API endpoints for programmatic access
- Rate limiting for API protection (100 requests per 15 minutes per IP)

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The server will start on http://localhost:3000

## API Routes

### Web Routes (HTML)

- `GET /` - Displays a list of all users
- `GET /:username` - Displays the profile page for a specific user

### API Routes (JSON)

- `GET /api/users` - Returns an array of all usernames
- `GET /api/users/:username` - Returns the JSON data for a specific user

## Data Structure

User data is stored in JSON files in the `data/` folder. Each file should be named `{username}.json` and contain:

```json
{
  "username": "demo",
  "name": "Alex the Awesome",
  "email": "alex@superstars.dev",
  "bio": "Professional bug creator turned bug destroyer 🐛💥",
  "location": "Bangalore, India",
  "favoriteColor": "Electric Blue",
  "favoriteGame": "Among Us (always sus 👀)",
  "hobbies": "Collecting rubber ducks, speed-cubing, making terrible puns",
  "superpower": "The ability to understand my own code from 6 months ago",
  "favoriteSnack": "Masala Pringles and cold coffee",
  "funFact": "I once debugged code in my dreams and it actually worked!",
  "customization": {
    "backgroundColor": "midnightblue",
    "backgroundImage": "",
    "profileImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  }
}
```

### Profile Fields

All fields are optional. Have fun and be creative!

**Basic Info:**
- **username**: Your unique username
- **name**: Your display name (can be fun and quirky!)
- **email**: Your email address
- **bio**: A short bio about yourself
- **location**: Where you're located

**Fun & Personality:**
- **favoriteColor**: Your favorite color
- **favoriteGame**: The game you love to play
- **hobbies**: What you do for fun
- **superpower**: What superpower you wish you had
- **favoriteSnack**: Your go-to snack
- **funFact**: Something interesting about you

### Customization Options

The `customization` object is optional and allows users to personalize their profile pages:

- **backgroundColor**: Color for the page background. Can be a color name (e.g., `"midnightblue"`, `"coral"`, `"lime"`) OR a hex code (e.g., `"#2c3e50"`). Check out [W3Schools Color Names](https://www.w3schools.com/colors/colors_names.asp) for a full list of color options!
- **backgroundImage**: URL to a background image (leave empty `""` for solid color)
- **profileImage**: URL to a profile picture (try [DiceBear Avatars](https://www.dicebear.com/) for cool avatar generators!)

**Note**: Text color is automatically calculated based on the background color to ensure optimal contrast and readability.

## Adding New Users

To add a new user, create a new JSON file in the `data/` folder with the user's information following the structure above. The `customization` object is optional - if omitted, default styling will be used.
