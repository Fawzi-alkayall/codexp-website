# flutter_login_app

Simple Flutter app with a login screen (email + password), built as a starting point for your mobile project.

## Features

- Modern login UI with validation
- Email and password fields with visibility toggle
- Remember Me functionality with persistent storage
- Auto-login on app restart
- Glassmorphism design throughout the app
- **Create New Job** feature with comprehensive job creation form:
  - Job title
  - Group selection (paginated API)
  - Legal entity (filtered by selected group)
  - Brand selection
  - Delivery date picker
  - Country selection
  - Art delivery method (By hand, URL, or Email)
  - Conditional fields for Email/URL delivery methods
  - Related items with quantity
  - Location selection
- Integration with RPE backend APIs for authentication and job management
- Loading state and feedback via SnackBar

## Run locally

Prerequisites:
- Flutter SDK installed (stable channel)
- macOS 13+ (for iOS development you also need Xcode)

Install dependencies:

```bash
flutter pub get
```

### Web (quickest)

```bash
flutter run -d chrome
```

### iOS (Simulator)

1) Install Xcode from the App Store (skip if already installed).
2) Accept and initialize Xcode tools once (first run only):

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

3) Install CocoaPods (already handled by this project setup, run if needed):

```bash
brew install cocoapods
```

4) Run on iOS simulator:

```bash
flutter run -d ios
```

If the simulator doesn't open automatically, you can open it manually from Xcode > Xcode Menu > Settings… > Platforms > iOS > Manage, or via:

```bash
open -a Simulator
```

## Notes

- Android builds require Android Studio + SDKs. See `flutter doctor` for setup.
- You can also use the VS Code task “Flutter: Run (iOS Simulator)” or “Flutter: Run (Web)” from the Command Palette > Run Task.

## Useful links

- [Flutter: Write your first app](https://docs.flutter.dev/get-started/codelab)
- [Flutter Cookbook](https://docs.flutter.dev/cookbook)
- [Flutter docs](https://docs.flutter.dev/)
