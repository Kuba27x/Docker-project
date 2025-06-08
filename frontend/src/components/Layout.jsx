import Navbar from "./Navbar";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
	const location = useLocation();
	const isLandingPage = location.pathname === "/";

	return (
		<AuthProvider>
			<ThemeProvider>
				<CssBaseline />
				<Box
					sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
					<Navbar />
					<Box
						component='main'
						sx={{
							flexGrow: 1,
							width: "100%",
							mt: "64px",
							p: isLandingPage ? 0 : 3
						}}>
						{children}
					</Box>
				</Box>
			</ThemeProvider>
		</AuthProvider>
	);
};

export default Layout;
