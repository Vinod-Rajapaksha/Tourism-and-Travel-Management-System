# React Calendar View

A beautiful, responsive, view-only React calendar application built with TypeScript, Tailwind CSS, and date-fns.

## Features

- 📅 **Month View**: Clean grid layout showing all days of the month
- 🎯 **Today Highlighting**: Current date is prominently highlighted
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- 🎨 **Event Display**: Events shown as colored dots and labels
- 🔍 **Event Details**: Click any day to view detailed event information
- 🚀 **Navigation**: Easy month navigation with Previous/Next/Today buttons
- 📊 **Read-Only**: No editing capabilities - perfect for viewing schedules

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **date-fns** for date manipulation
- **Vite** for fast development and building

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Calendar.tsx          # Main calendar component
│   ├── MonthView.tsx         # Month grid layout
│   ├── DayCell.tsx           # Individual day cell
│   └── EventModal.tsx        # Event details modal
├── data/
│   └── sampleEvents.ts       # Sample event data
├── types/
│   └── Event.ts              # TypeScript type definitions
├── utils/
│   └── dateUtils.ts          # Date utility functions
├── App.tsx                   # Main app component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

## Event Data Structure

Events are defined with the following structure:

```typescript
type Event = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  color?: string; // blue, green, purple, orange, red, pink
  description?: string;
  time?: string;
};
```

## Features in Detail

### Month Navigation
- **Previous/Next**: Navigate between months
- **Today**: Jump back to current month and date
- **Month/Year Display**: Shows current month and year

### Event Display
- **Color-coded Events**: Each event has a color for easy identification
- **Event Dots**: Small colored dots show event presence
- **Event Labels**: Event titles displayed in day cells
- **Event Count**: Shows "+X more" when there are additional events

### Responsive Design
- **Mobile**: Optimized for touch interactions
- **Tablet**: Balanced layout for medium screens
- **Desktop**: Full-featured layout with hover effects

### Event Modal
- **Detailed View**: Shows all events for a selected day
- **Event Information**: Displays title, time, and description
- **Empty State**: Shows message when no events are scheduled
- **Easy Close**: Click outside or X button to close

## Customization

### Adding New Events
Edit `src/data/sampleEvents.ts` to add or modify events:

```typescript
{
  id: 'unique-id',
  title: 'Event Title',
  date: '2024-01-15',
  color: 'blue', // or green, purple, orange, red, pink
  description: 'Event description',
  time: '10:00 AM'
}
```

### Styling
The application uses Tailwind CSS. You can customize colors and styles in:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Custom CSS classes

### Date Format
The application uses `date-fns` for date formatting. You can modify date formats in `src/utils/dateUtils.ts`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!
