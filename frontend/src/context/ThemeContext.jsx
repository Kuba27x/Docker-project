import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { getThemeOptions } from "../lib/theme";
const ThemeContext = createContext({
	mode: "light",
	toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
	const [mode, setMode] = useState("light");

	useEffect(() => {
		const savedMode = localStorage.getItem("themeMode");
		if (savedMode) {
			setMode(savedMode);
		} else {
			const prefersDarkMode = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			setMode(prefersDarkMode ? "dark" : "light");
		}
	}, []);

	const toggleTheme = () => {
		const newMode = mode === "light" ? "dark" : "light";
		setMode(newMode);
		localStorage.setItem("themeMode", newMode);
	};

	const theme = createTheme(getThemeOptions(mode));

	return (
		<ThemeContext.Provider value={{ mode, toggleTheme }}>
			<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};
