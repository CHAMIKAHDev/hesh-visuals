# HESH VISUALS — Cinematic Dark Portfolio

A responsive, static portfolio website made with HTML, CSS, and vanilla JavaScript. It can be hosted free on GitHub Pages.

## Preview locally
1. Extract this ZIP.
2. Open the `hesh_visuals_portfolio` folder.
3. Double-click `index.html` to preview in a browser. (Internet is only needed for Google Fonts.)

## Before publishing, personalize these items
Open `index.html` in VS Code and search for:
- `your.email@example.com` — replace with your real email.
- `href="#"` on Instagram, Behance, and YouTube — replace with your actual profile links.
- Project titles and descriptions — change to match your actual work.
- Skills list — remove any tools you don't actually use.

## Add your existing videos
1. Create a folder named `assets` (already included).
2. Copy your video files into `assets/`.
3. To show a real video instead of a CSS-designed placeholder, replace a project's `<a class="project-visual ...">...</a>` content with, for example:

```html
<a class="project-visual" href="#contact" aria-label="View my product edit">
  <video class="project-video" controls preload="metadata" playsinline poster="assets/my-video-poster.jpg">
    <source src="assets/my-video.mp4" type="video/mp4">
  </video>
</a>
```

Add this to `style.css`:

```css
.project-video { width: 100%; height: 100%; object-fit: cover; display: block; }
```

Use optimized MP4 files for faster loading. Don't upload large original project files to GitHub; compress exported portfolio clips first. Make sure you have permission to publish any client work or music used.

## Publish with GitHub Pages
1. Create a new GitHub repository, e.g. `hesh-visuals`.
2. Upload `index.html`, `style.css`, `script.js`, and the `assets` folder to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for GitHub Pages to deploy. Your site address will look like `https://YOUR-USERNAME.github.io/hesh-visuals/`.

GitHub Pages settings labels may vary slightly by interface. You do not need to buy a domain. A custom domain is optional and usually costs money.


## Adding portfolio videos
Place your MP4 files in `assets/` and name them `video-01.mp4`, `video-02.mp4`, and `video-03.mp4` to match the current cards. Each card uses the video's first available frame as its thumbnail. To add more cards later, duplicate one of the video project `<article>` blocks in `index.html` and update the video filename, project number, and title.
