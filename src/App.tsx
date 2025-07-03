import React, { useEffect } from "react";
import Index from "./pages/Index";

const App = () => {
  // Allow cell navigation with keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling behavior when arrow keys are pressed
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
        // Only prevent if focus is in the spreadsheet
        if (document.activeElement?.closest('.bg-[#F6F6F6]')) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <Index />;
};

export default App;
