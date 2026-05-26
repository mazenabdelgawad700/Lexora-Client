import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider, useTheme } from "./hooks";
import { Navbar } from "./components/Navbar";
import { AddWordModal } from "./components/AddWordModal";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
import WordDetailsPage from "./pages/WordDetailsPage";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

function AnimatedRoutes({ onAddWord }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/Lexora-Client"
          element={
            <motion.div {...pageVariants} key="dashboard">
              <DashboardPage onAddWord={onAddWord} />
            </motion.div>
          }
        />
        <Route
          path="/Lexora-Client/search"
          element={
            <motion.div {...pageVariants} key="search">
              <SearchPage />
            </motion.div>
          }
        />
        <Route
          path="/Lexora-Client/word/:id"
          element={
            <motion.div {...pageVariants} key="word-details">
              <WordDetailsPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { isLoading } = useTheme();
  const addModalRef = React.useRef(null);

  const handleOpenAddModal = () => {
    if (addModalRef.current) {
      addModalRef.current.open();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent-200 dark:border-accent-800 border-t-accent-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading Lexora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar onAddClick={handleOpenAddModal} />

      <main className="transition-theme">
        <AnimatedRoutes onAddWord={handleOpenAddModal} />
      </main>

      {/* Add word modal - global */}
      <AddWordModalWrapper ref={addModalRef} />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-text)",
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
    </div>
  );
}

const AddWordModalWrapper = React.forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  return (
    <AddWordModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={() => setIsOpen(false)}
    />
  );
});

AddWordModalWrapper.displayName = "AddWordModalWrapper";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
