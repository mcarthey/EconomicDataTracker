# Economic Data Tracker - Angular Frontend

This is the Angular frontend application for the Economic Data Tracker, providing interactive visualizations and dashboards for economic indicators.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Angular CLI globally (if not already installed):
```bash
npm install -g @angular/cli
```

## Development

### Running the Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Configuration

### API Endpoint Configuration

The API endpoint can be configured in the environment files:

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

Update the `apiUrl` property to point to your API server.

## Project Structure

```
src/
├── app/
│   ├── components/          # UI Components
│   │   ├── dashboard/       # Main dashboard view
│   │   ├── indicator-chart/ # Chart component for indicators
│   │   ├── series-selector/ # Multi-select for economic series
│   │   └── date-range-filter/ # Date range picker
│   ├── models/              # TypeScript interfaces
│   ├── services/            # API services
│   ├── app.component.ts     # Root component
│   └── app.config.ts        # Application configuration
├── environments/            # Environment configurations
├── assets/                  # Static assets
├── styles.css              # Global styles
└── index.html              # Main HTML file
```

## Features

- **Dashboard Summary Cards**: Display latest values and changes for all economic indicators
- **Interactive Charts**: Line charts showing trends over time using Chart.js
- **Filtering Options**:
  - Select specific economic indicators
  - Choose time periods (1 month to 10 years)
  - Custom date range selection
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Fetches data from the ASP.NET Core Web API

## API Integration

The application integrates with the Economic Data Tracker API with the following endpoints:

- `GET /api/series` - Get all economic series
- `GET /api/series/{id}/observations` - Get observations for a series
- `GET /api/observations` - Get filtered observations
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/trends` - Get trend data

## Deployment

### Static Hosting (Recommended for Production)

The Angular application can be deployed to any static hosting service:

1. **Azure Static Web Apps**
2. **AWS S3 + CloudFront**
3. **Netlify**
4. **Vercel**
5. **GitHub Pages**

### Build for Production

```bash
ng build --configuration production
```

The build output in `dist/economic-data-tracker-web` can be deployed to your chosen hosting service.

### Environment Variables

Before deploying to production, update `src/environments/environment.prod.ts` with your production API URL.

## Technologies Used

- **Angular 17**: Frontend framework
- **Chart.js**: Charting library
- **ng2-charts**: Angular wrapper for Chart.js
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe JavaScript

## License

Part of the Economic Data Tracker solution.
