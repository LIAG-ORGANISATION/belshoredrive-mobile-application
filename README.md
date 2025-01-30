# Belshore App

A React Native application built with Expo, featuring a robust UI component library built with NativeWind (Tailwind CSS), and Storybook integration.

## 🚀 Tech Stack

- [Expo](https://expo.dev/) - React Native framework
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for React Native
- [Storybook](https://storybook.js.org/) - UI component development environment
- [Biome](https://biomejs.dev/) - Fast formatter and linter
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📱 Features

- Dark mode support
- Type-safe routing with Expo Router
- Component-driven development with Storybook
- Customizable theming system
- Cross-platform support (iOS, Android, Web)

## 🛠️ Prerequisites

- Node.js (v22 or higher)
- npm
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd belshore-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

   or

   ```bash
   npm run start
   ```

   # For iOS
   ```bash
   npm run ios
   ```

   # For Android
   ```bash
   npm run android
   ```

   # For web
   ```bash
   npm run web
   ```

4. To run Storybook:

   * The app will start in Storybook mode by default
   * To disable Storybook, set isStoryBookEnabled to false in src/app/_layout.tsx

## 📁 Project Structure

- `src/app/`: Root navigation and layout components with expo-router
- `src/components/`: Reusable UI components
- `src/lib/`: Utility functions and types
- `src/types/`: Type definitions
- `src/hooks/`: Custom hooks
- `src/contexts/`: Context providers
- `/assets/`: Static assets (images, fonts, etc.)

## Storybook

See https://storybook.js.org/docs/get-started/whats-a-story

## Expo Router

See https://docs.expo.dev/develop/file-based-routing/

## Biome

See https://biomejs.dev/