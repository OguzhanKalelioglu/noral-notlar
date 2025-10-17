# ScribbleCast: A Whimsical Podcast Landing Page

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OguzhanKalelioglu/generated-app-20251017-072518)

ScribbleCast is a visually stunning, single-page promotional website for a podcast. Designed with a whimsical and illustrative artistic style, it aims to captivate visitors from the moment they land. The page features a vibrant hero section with a custom, sketchy illustration, a clear call-to-action, and an introduction to the podcast's theme. Scrolling down, users will find a curated list of the latest episodes presented in beautiful cards, a section introducing the hosts with playful bios, and prominent links to listen on major podcast platforms. The design is anchored by a warm, inviting color palette and unique typography that blends a hand-drawn heading font with a clean, modern sans-serif for readability. A key feature is the integrated newsletter subscription form, allowing the podcast to build its community. The entire experience is polished with subtle micro-interactions and smooth animations, creating a delightful and memorable user journey.

## Key Features

-   **Whimsical & Illustrative Design:** A unique, hand-drawn aesthetic that stands out.
-   **Single-Page Experience:** A seamless, scrollable journey through all content.
-   **Episode Listings:** Beautifully designed cards to showcase recent podcast episodes.
-   **Host Introductions:** A dedicated section to connect the audience with the hosts.
-   **Newsletter Signup:** An integrated form to build a community and mailing list.
-   **Podcast Platform Links:** Easy access for users to listen on their favorite platforms like Spotify and Apple Podcasts.
-   **Fully Responsive:** A flawless experience on desktops, tablets, and mobile devices.

## Technology Stack

-   **Framework:** React (Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui
-   **Icons:** Lucide React
-   **Animations:** Framer Motion
-   **Deployment:** Cloudflare Pages & Workers

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/scribblecast-podcast-landing.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd scribblecast-podcast-landing
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```

## Development

To start the local development server, run the following command. This will open the application on `http://localhost:3000` (or the next available port).

```sh
bun run dev
```

The server supports hot-reloading, so any changes you make to the source code will be reflected in the browser instantly.

## Building for Production

To create a production-ready build of the application, run:

```sh
bun run build
```

This command bundles the application into the `dist` directory, optimized for performance.

## Deployment

This project is configured for easy deployment to Cloudflare Pages.

### One-Click Deploy

You can deploy this project to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OguzhanKalelioglu/generated-app-20251017-072518)

### Manual Deployment with Wrangler

1.  **Authenticate with Wrangler:**
    If this is your first time using Wrangler, you'll need to log in to your Cloudflare account.
    ```sh
    bunx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build and deploy your application to Cloudflare.
    ```sh
    bun run deploy
    ```

Wrangler will handle the process of uploading your static assets to Cloudflare Pages and deploying the serverless functions.