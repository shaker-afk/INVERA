# INVERA 📈

A mobile investment platform for Jordan, built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).

---

## Prerequisites

Before running the app, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — install globally:
  ```bash
  npm install -g expo-cli
  ```
- [Expo Go](https://expo.dev/go) app on your iOS or Android device — for quick previews without a simulator

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shaker-afk/INVERA.git
cd INVERA
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the Expo development server

```bash
npm start
# or equivalently:
npx expo start
```

This launches the **Expo DevTools** in your terminal. You'll see a QR code and several options to open the app.

---

## Running on a Device or Emulator

Once the dev server is running, choose how you want to open the app:

### 📱 Physical Device (Expo Go) — Easiest

1. Install **Expo Go** on your phone:
   - [Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
2. Make sure your phone and computer are on the **same Wi-Fi network**.
3. Scan the QR code shown in the terminal with:
   - **Android**: The Expo Go app's built-in QR scanner
   - **iOS**: The native Camera app

> If you're on a restricted network, start with tunnel mode instead:
>
> ```bash
> npx expo start --tunnel
> ```

---

### 🤖 Android Emulator

1. Install [Android Studio](https://developer.android.com/studio) and set up an Android Virtual Device (AVD).
2. Start the emulator from Android Studio (or `emulator -avd <name>`).
3. Run:
   ```bash
   npm run android
   # or:
   npx expo start --android
   ```

---

### 🍎 iOS Simulator (macOS only)

1. Install [Xcode](https://developer.apple.com/xcode/) from the Mac App Store.
2. Run:
   ```bash
   npm run ios
   # or:
   npx expo start --ios
   ```

---

### 🌐 Web Browser

```bash
npm run web
# or:
npx expo start --web
```

> Web support is experimental and may not reflect the full mobile experience.

---

## Project Structure

```
INVERA/
├── app/              # File-based routing (Expo Router)
├── src/
│   ├── components/   # Reusable UI components (atoms, molecules, etc.)
│   ├── screens/      # Screen-level components
│   └── constants/    # Theme, colors, typography
├── assets/           # Images, icons, fonts
├── app.json          # Expo app configuration
└── package.json      # Dependencies and scripts
```

---

## Available Scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm start`       | Start the Expo dev server                 |
| `npm run android` | Start and open on Android emulator/device |
| `npm run ios`     | Start and open on iOS simulator           |
| `npm run web`     | Start in web browser                      |
| `npm run lint`    | Run ESLint on the project                 |

---

## Troubleshooting

**Metro bundler stuck or crashing?**

```bash
npx expo start --clear
```

**Dependencies out of sync?**

```bash
npx expo install --fix
```

**Can't connect on physical device?**  
Try tunnel mode:

```bash
npx expo start --tunnel
```

> This requires `@expo/ngrok` which is already included as a dependency.

---

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
