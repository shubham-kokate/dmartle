# Dmartle

A daily price-guessing game for everyday DMart products, built for an Indian audience. Inspired by Costcodle.

Live at https://dmartle.io

## Run locally

No build step. Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

## Structure

- `index.html` page markup
- `css/style.css` styles and light/dark colour tokens
- `js/items.js` product list: `[name, pack size, emoji, price in rupees]`
- `js/app.js` game logic (6 guesses, win within 5%, daily puzzle by IST date)
- `CNAME` custom domain for GitHub Pages

## Customise

- Add or edit products in `js/items.js`. Prices are approximate, so verify them.
- Difficulty: `MAX` (guesses) and `WIN` (tolerance) at the top of `js/app.js`.
- Daily puzzle number offset: `ist-20000` in `js/app.js`.
