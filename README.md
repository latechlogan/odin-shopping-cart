# Shopping Cart

A modern e-commerce shopping cart application built with React, demonstrating key frontend development skills including state management, API integration, and responsive design.

[Live Demo](https://your-demo-link.netlify.app) • [Report Bug](https://github.com/latechlogan/odin-shopping-cart/issues)

## Overview

This project is a fully functional shopping cart application that fetches product data from an external API and provides a seamless shopping experience. Built as part of [The Odin Project](https://www.theodinproject.com/) curriculum, it showcases modern React development practices and frontend engineering skills.

## Features

- **Dynamic Product Catalog** - Browse products across multiple categories (electronics, fashion, jewelry)
- **Real-time Cart Management** - Add, remove, and update product quantities with instant feedback
- **Persistent Shopping Cart** - Cart state persists across sessions using localStorage
- **Product Details** - Detailed product pages with ratings and descriptions
- **Category Filtering** - Filter products by category for easier browsing
- **Responsive Design** - Mobile-first design that works on all screen sizes
- **Toast Notifications** - User-friendly feedback for cart actions
- **Loading States** - Smooth loading experience with custom loader component
- **Error Handling** - Graceful error handling for API failures

## Technical Highlights

### React & Modern JavaScript

- Built entirely with **functional components** and **React Hooks** (useState, useEffect, useContext, useMemo)
- Custom hooks for clean, reusable logic
- Advanced state management patterns with proper immutability

### State Management

- **Context API** implementation for global cart state management
- Custom `CartProvider` with optimized re-renders using `useMemo`
- localStorage integration for persistent cart data
- Proper error boundaries and data validation

### API Integration

- Asynchronous data fetching from [Fake Store API](https://fakestoreapi.com/)
- Loading and error state management
- HTTP error handling with user-friendly error messages

### Routing

- Client-side routing with **React Router v7**
- Dynamic route parameters for product details
- URL-based category filtering with search params

### UI/UX Libraries

- **React Hot Toast** - Modern toast notifications for user feedback
- **React Feather** - Clean, consistent iconography
- **React Flexible Star Rating** - Interactive product ratings display
- **ldrs** - Lightweight animated loaders

### Testing

- Unit tests with **Vitest** and **React Testing Library**
- Component testing for core features (Cart, AddToCart, Navigation)
- Test coverage for Context API implementation

### Developer Experience

- **Vite** for fast builds and hot module replacement
- ESLint configuration for code quality
- Clean project structure with separation of concerns
- CSS Modules for component-scoped styling

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddToCart/
│   ├── CategoryCard/
│   ├── Error/
│   ├── Hero/
│   ├── Loader/
│   └── Nav/
├── contexts/           # React Context providers
│   └── CartContext.jsx
├── routes/             # Route components
│   ├── Cart.jsx
│   ├── Home.jsx
│   ├── ProductDetails.jsx
│   └── Products.jsx
└── App.jsx             # Root component with routing
```

## Installation & Usage

```bash
# Clone the repository
git clone git@github.com:latechlogan/odin-shopping-cart.git

# Navigate to project directory
cd odin-shopping-cart

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Key Learnings

- Building a scalable React application architecture
- Managing complex state across multiple components
- Integrating third-party APIs with proper error handling
- Implementing persistent data storage with localStorage
- Creating reusable, testable components
- Writing comprehensive unit tests for React components
- Using modern React patterns and best practices

## Technologies Used

**Core:**

- React 19
- React Router v7
- Vite

**State & Data:**

- Context API
- localStorage API
- Fetch API

**UI Components:**

- React Hot Toast
- React Feather Icons
- React Flexible Star Rating
- ldrs (Loaders)

**Testing:**

- Vitest
- React Testing Library
- jsdom

**Code Quality:**

- ESLint
- CSS Modules

<!-- ## Future Enhancements

- Add user authentication
- Implement checkout flow
- Add product search functionality
- Include sorting options (price, rating)
- Add product comparison feature
- Implement wish list functionality -->

## Acknowledgments

This project was built as part of [The Odin Project's](https://www.theodinproject.com/) React curriculum.

## License

This project is open source and available under the MIT License.
