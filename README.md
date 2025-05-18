# Periodic Table of the Elephants

A playful, interactive web application built with Next.js and TypeScript that displays the periodic table of elements. When you click on an element, a modal opens showing detailed information and, if available, a corresponding elephant image with a creative caption.

## Features

- Interactive periodic table with color-coded element categories
- Elephant images for elements with creative captions
- Progress tracker showing how many elephants have been discovered
- Admin panel for adding new elephant images
- AI-powered generator for creating elephant images
- Responsive design that works on desktop and mobile devices
- Detailed element information displayed in a modal
- Dark mode support

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- React

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Provide an OpenAI API key in an environment variable so the app can generate images:

```bash
export OPENAI_API_KEY=your-key-here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Structure

- `src/app/`: Next.js app router
- `src/components/`: React components
- `src/data/`: JSON data files for elements and elephant images
- `src/types/`: TypeScript type definitions

## Customization

### Adding Elephant Images

Elephant images can be added through the admin panel in the application. In a production environment, you would connect this to a database. For now, you can also edit the `src/data/element-images.json` file directly:

```json
{
  "H": {
    "imageUrl": "https://example.com/hydrogen-elephant.jpg",
    "caption": "Hydrogen Elephant - The Lightest Pachyderm"
  },
  "He": {
    "imageUrl": "https://example.com/helium-elephant.jpg",
    "caption": "Helium Elephant - Floating High"
  }
}
```

## Expansion Plans

- Backend integration to store elephant data persistently
- User authentication for admin functions
- Ability for users to suggest elephant images for approval
- Social sharing features
- Interactive elephant animations

## License

This project is open source and available under the MIT License.