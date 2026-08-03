import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  primaryColor: string;
  bgColor: string;
  textColor: string;
  cardColor: string;
  cardBorderColor: string;
  mutedColor: string;
  setTheme: (primary: string, bg: string, text: string, card: string, cardBorder: string, muted: string) => void;
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
  const [cardColor, setCardColor] = useState(() => 
    localStorage.getItem("cardColor") || "0 0% 100%"
  );
  const [cardBorderColor, setCardBorderColor] = useState(() => 
    localStorage.getItem("cardBorderColor") || "239 60% 88%"
  );
  const [mutedColor, setMutedColor] = useState(() => 
    localStorage.getItem("mutedColor") || "239 35% 45%"
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-hsl", primaryColor);
    document.documentElement.style.setProperty("--bg-hsl", bgColor);
    document.documentElement.style.setProperty("--text-hsl", textColor);
    document.documentElement.style.setProperty("--card-hsl", cardColor);
    document.documentElement.style.setProperty("--card-border-hsl", cardBorderColor);
    document.documentElement.style.setProperty("--muted-hsl", mutedColor);
    
    document.documentElement.style.setProperty("--primary-color", `hsl(${primaryColor})`);
    
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("textColor", textColor);
    localStorage.setItem("cardColor", cardColor);
    localStorage.setItem("cardBorderColor", cardBorderColor);
    localStorage.setItem("mutedColor", mutedColor);
  }, [primaryColor, bgColor, textColor, cardColor, cardBorderColor, mutedColor]);

  const setTheme = (primary: string, bg: string, text: string, card: string, cardBorder: string, muted: string) => {
    setPrimaryColor(primary);
    setBgColor(bg);
    setTextColor(text);
    setCardColor(card);
    setCardBorderColor(cardBorder);
    setMutedColor(muted);
  };

  return (
    <ThemeContext.Provider value={{ primaryColor, bgColor, textColor, cardColor, cardBorderColor, mutedColor, setTheme }}>
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
