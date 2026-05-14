import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  primaryColor: string;
  bgColor: string;
  textColor: string;
  setTheme: (primary: string, bg: string, text: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(() => 
    localStorage.getItem("primaryColor") || "239 84% 67%"
  );
  const [bgColor, setBgColor] = useState(() => 
    localStorage.getItem("bgColor") || "239 100% 98%"
  );
  const [textColor, setTextColor] = useState(() => 
    localStorage.getItem("textColor") || "239 60% 20%"
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-hsl", primaryColor);
    document.documentElement.style.setProperty("--bg-hsl", bgColor);
    document.documentElement.style.setProperty("--text-hsl", textColor);
    
    document.documentElement.style.setProperty("--primary-color", `hsl(${primaryColor})`);
    
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("textColor", textColor);
  }, [primaryColor, bgColor, textColor]);

  const setTheme = (primary: string, bg: string, text: string) => {
    setPrimaryColor(primary);
    setBgColor(bg);
    setTextColor(text);
  };

  return (
    <ThemeContext.Provider value={{ primaryColor, bgColor, textColor, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
