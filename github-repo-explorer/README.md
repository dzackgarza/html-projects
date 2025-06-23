# GitHub Repo Explorer

A sophisticated web application that provides an enhanced interface for browsing, organizing, and analyzing GitHub repositories with AI-powered insights.

![GitHub Repo Explorer](https://img.shields.io/badge/React-TypeScript-blue) ![AI Powered](https://img.shields.io/badge/AI-Powered-green) ![Vite](https://img.shields.io/badge/Build-Vite-purple)

## 🎯 **Purpose**

GitHub Repo Explorer transforms the standard GitHub interface into a more intelligent, organized, and insightful tool for developers. It combines repository management with AI analysis to provide deep insights into code quality, project structure, and improvement opportunities.

## ✨ **Key Features**

### 🔍 **Enhanced Repository Discovery**
- Browse any GitHub user's repositories with a clean, visual interface
- Advanced filtering by language, type (sources/forks), visibility, and archived status
- Flexible sorting by push date, update date, creation date, or name
- Fuzzy search functionality for rapid repository location
- Pin/unpin repositories for quick access to frequently used projects

### 🤖 **AI-Powered Repository Analysis**
- **Intelligent insights** using Google's Gemini API to analyze repository content
- **Automated code review** that examines repository structure and provides:
  - Project summaries and purpose analysis
  - Quality scores (70-95 range) with detailed rationales
  - Technical feedback and improvement suggestions
  - Creative enhancement ideas
  - Documentation recommendations
- **Real-time progress tracking** during AI analysis with detailed status updates

### 🎨 **Visual Organization & UX**
- **Color-coded language indicators** with 30+ programming language support
- **Repository cards** displaying key metadata (description, topics, last push date, visibility)
- **Grouping capabilities** by language or visibility
- **Writing-focused mode** highlighting Markdown and TeX repositories
- **Dark theme** optimized for developer workflows
- **Responsive design** for desktop and mobile

### 🛠️ **Developer Productivity Tools**
- **Persistent state management** - remembers preferences, pinned repos, and settings
- **Quick access links** to repository settings and GitHub pages
- **Keyboard shortcuts** for efficient navigation
- **Export capabilities** for AI insights (copy to clipboard)
- **Local storage** for seamless user experience across sessions

## 🎯 **Use Cases**

- **Portfolio Review**: Showcase GitHub repositories with AI-generated insights
- **Code Discovery**: Explore and analyze repositories from other developers
- **Project Management**: Organize and prioritize personal repositories
- **Code Quality Assessment**: Get AI feedback on repository structure and improvements
- **Research & Learning**: Understand project architectures and enhancement opportunities

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v18 or higher)
- GitHub Personal Access Token
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-repo-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GITHUB_API_TOKEN=your_github_personal_access_token_here
   ```

   **Getting API Keys:**
   - **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **GitHub Token**: Generate from [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ **Technical Architecture**

- **Frontend**: React 19 + TypeScript
- **Build System**: Vite 6 for fast development and optimized builds
- **APIs**: 
  - GitHub REST API v4 (via Octokit)
  - Google Gemini API for AI analysis
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: React hooks with localStorage persistence
- **Security**: Environment variables for API key management

## 🔧 **Configuration**

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI insights | Yes |
| `GITHUB_API_TOKEN` | GitHub Personal Access Token | Yes |

### Features Toggle

The app includes several toggleable features:
- **Writing Only Mode**: Filter to show only Markdown/TeX repositories
- **Show Archived**: Include archived repositories in results
- **Grouping**: Organize repositories by language or visibility
- **AI Insights**: Enable/disable AI-powered repository analysis

## 📱 **Usage**

1. **Enter a GitHub username** in the search field
2. **Browse repositories** with enhanced visual cards
3. **Use filters and sorting** to organize results
4. **Pin important repositories** for quick access
5. **Click the sparkles icon** on any repository for AI insights
6. **Export insights** using the copy button in the AI modal

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 **License**

This project is open source and available under the MIT License.

## 🔗 **Links**

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Google Gemini API](https://ai.google.dev/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**Built with ❤️ for the developer community**
