# File Placement Instructions

## 📁 Required Files

Please add the following files to complete the website setup:

### 1. Contract PDF
- **File Name**: `Crossroads_Contract.pdf`
- **Location**: Place in `/assets/documents/`
- **Full Path**: `/Users/joezayas2/crossroads-sober-living-website/assets/documents/Crossroads_Contract.pdf`
- **What to do**: 
  1. Locate your Crossroads Resident Contract PDF
  2. Rename it to `Crossroads_Contract.pdf`
  3. Copy it into the `assets/documents` folder
  4. The website will automatically display and allow downloads

### 2. Logo Image
- **File Name**: `crossroads_logo.png` (or `.jpg`, `.svg`)
- **Location**: Place in `/assets/images/`
- **Full Path**: `/Users/joezayas2/crossroads-sober-living-website/assets/images/crossroads_logo.png`
- **What to do**:
  1. Locate your Crossroads logo file
  2. Rename it to `crossroads_logo.png` (or keep as .jpg/.svg)
  3. Copy it into the `assets/images` folder
  4. If using .jpg or .svg, update the file extension in all HTML files

**Note**: If your logo is in a different format (JPG or SVG), you'll need to update the extension in the navigation sections of all HTML files.

## 🔧 If Logo Format is Different

If you're using `.jpg` or `.svg` instead of `.png`:

1. Update the image source in these files:
   - index.html (line ~13)
   - about.html (line ~13)
   - program.html (line ~13)
   - contact.html (line ~13)
   - contract.html (line ~13)

2. Change this:
   ```html
   <img src="assets/images/crossroads_logo.png" alt="Crossroads Sober Living Logo" class="nav-logo">
   ```
   
   To this (for JPG):
   ```html
   <img src="assets/images/crossroads_logo.jpg" alt="Crossroads Sober Living Logo" class="nav-logo">
   ```

## ✅ Verification

After adding files:
1. Open `index.html` in a browser
2. Logo should appear in the navigation bar
3. Visit the "House Guidelines" page
4. Contract PDF should be embedded and downloadable

## 📂 Current Folder Structure

```
crossroads-sober-living-website/
├── assets/
│   ├── documents/
│   │   └── Crossroads_Contract.pdf  ← PUT CONTRACT HERE
│   └── images/
│       └── crossroads_logo.png      ← PUT LOGO HERE
├── css/
├── js/
└── [HTML files]
```

## Need Help?

If you have issues, contact your web developer or reach out for assistance.
