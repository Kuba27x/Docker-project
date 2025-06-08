import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuthStatus = () => {
			const token = localStorage.getItem("token");
			const storedUser = localStorage.getItem("user");

			setIsLoading(true);

			if (token) {
				setIsLoggedIn(true);
				if (storedUser) {
					try {
						setUser(JSON.parse(storedUser));
					} catch (e) {
						console.error("Failed to parse user from localStorage", e);
					}
				}
			} else {
				setIsLoggedIn(false);
				setUser(null);
			}

			setIsLoading(false);
		};

		checkAuthStatus();
	}, []);

	const login = (token, userData) => {
		localStorage.setItem("token", token);
		if (userData) {
			localStorage.setItem("user", JSON.stringify(userData));
			setUser(userData);
		}
		setIsLoggedIn(true);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		setIsLoggedIn(false);
	};

	const getToken = () => {
		return localStorage.getItem("token");
	};

	const refreshUser = () => {
		const token = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");
		if (token) {
			setIsLoggedIn(true);
			if (storedUser) {
				try {
					setUser(JSON.parse(storedUser));
				} catch (e) {
					console.error("Failed to parse user from localStorage", e);
				}
			}
		} else {
			setIsLoggedIn(false);
			setUser(null);
		}
	};

	const authContextValue = {
		isLoggedIn,
		login,
		logout,
		getToken,
		user,
		setUser,
		isLoading,
		refreshUser
	};

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
};
