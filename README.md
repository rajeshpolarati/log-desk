# 🕐 Log Desk - Time Tracking Application

A modern, feature-rich time tracking web application built with React and TypeScript. Track your daily work hours with precision and maintain a beautiful, responsive interface.

## ✨ Features

### 🕐 Core Functionality
- **Login/Logout Tracking**: Record start and end times for work sessions
- **Real-time Clock**: Live current time display that updates every second
- **Duration Calculation**: Automatically calculates work duration (8.5-hour standard shift)
- **Expected Logout**: Shows when you should log out based on your login time
- **Status Tracking**: Visual indicators for "Not Started", "Logged In", or "Completed" states

### 📊 Data Management
- **Persistent Storage**: Uses localStorage with security validation
- **Editable History**: Click any log entry to edit login/logout times
- **Data Integrity**: Built-in checksums and validation to prevent corruption
- **Reset Functionality**: Clear all data when needed

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Toast Notifications**: User-friendly feedback for all actions
- **Hover Effects**: Interactive elements with smooth transitions

### 🔒 Security Features
- **Input Sanitization**: Prevents XSS and injection attacks
- **Data Validation**: Comprehensive validation of all time and date inputs
- **Integrity Checks**: Checksums to detect data corruption
- **Safe Storage**: Secure localStorage operations with error handling

## 🚀 Live Demo

Visit the live application: [Log Desk](https://your-username.github.io/your-repo-name/)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Toast System**: Sonner
- **Theme**: next-themes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── TimeTracker.tsx
│   ├── EditableTimeLog.tsx
│   ├── ThemeToggle.tsx
│   └── ResetButton.tsx
├── lib/
│   ├── security.ts   # Data validation & sanitization
│   └── utils.ts      # Utility functions
├── pages/
│   ├── Index.tsx
│   └── NotFound.tsx
├── providers/
│   └── ThemeProvider.tsx
└── App.tsx
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Usage

1. **Login**: Click the "Login" button to start tracking your work session
2. **Monitor**: Watch the real-time clock and expected logout time
3. **Logout**: Click "Logout" when you finish your work session
4. **Edit**: Click any log entry to modify times if needed
5. **Reset**: Use the reset button to clear all data

## 🎯 Data Structure

Each time log entry contains:
```typescript
interface TimeLog {
  date: string;           // YYYY-MM-DD format
  loginTime: string;      // "9:00 AM" format
  logoutTime?: string;    // "5:30 PM" format (optional)
  duration?: string;      // "8h 30m" format (calculated)
}
```

## 🌐 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. Builds the application on every push to main/master branch
2. Deploys the built files to GitHub Pages
3. Provides a live URL for your application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Toast notifications with [Sonner](https://sonner.emilkowal.ski/)

---

Made with ❤️ for productive time tracking
