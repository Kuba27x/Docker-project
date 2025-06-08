import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	IconButton,
	Box,
	Menu,
	MenuItem,
	Button,
	Avatar,
	Tooltip,
	Typography,
	Drawer,
	Link as MuiLink,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	useMediaQuery,
	useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useTheme as useAppTheme } from "../context/ThemeContext";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
	const { isLoggedIn, logout, user } = useAuth();
	const { mode, toggleTheme } = useAppTheme();
	const navigation = useNavigate();
	const location = useLocation();
	const pathname = location.pathname;
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	const [mobileOpen, setMobileOpen] = useState(false);
	const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
	const [carsMenuAnchorEl, setCarsMenuAnchorEl] = useState(null);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleUserMenuOpen = (event) => {
		setUserMenuAnchorEl(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setUserMenuAnchorEl(null);
	};

	const handleCarsMenuOpen = (event) => {
		setCarsMenuAnchorEl(event.currentTarget);
	};

	const handleCarsMenuClose = () => {
		setCarsMenuAnchorEl(null);
	};

	const handleLogout = () => {
		handleUserMenuClose();
		logout();
		navigation("/", { replace: true });
	};

	const handleNavigation = (path) => {
		navigation(path);
		setMobileOpen(false);
		handleCarsMenuClose();
	};

	const createImage = () => user.username.charAt(0).toUpperCase();

	const menuItems = [
		{
			text: "Panel główny",
			icon: <DashboardIcon />,
			path: "/dashboard",
			authRequired: true
		},
		{
			text: "Lista pojazdów",
			icon: <DirectionsCarIcon />,
			path: "/cars",
			authRequired: true
		},
		{
			text: "Dodaj pojazd",
			icon: <AddCircleOutlineIcon />,
			path: "/add-car",
			authRequired: true
		},
		{
			text: "Wgraj CSV",
			icon: <CloudUploadIcon />,
			path: "/upload",
			authRequired: true
		},
		{
			text: "Statystyki",
			icon: <BarChartIcon />,
			path: "/statistics",
			authRequired: true
		}
	];

	const filteredMenuItems = menuItems.filter((item) =>
		isLoggedIn ? item.authRequired : !item.authRequired
	);

	const drawer = (
		<Box sx={{ width: 280 }} role='presentation'>
			<Box
				sx={{
					p: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}>
				<Typography
					variant='h6'
					component={MuiLink}
					href='/'
					sx={{ fontWeight: 700 }}>
					AutoData
				</Typography>
			</Box>
			<Divider />
			{isLoggedIn && user && (
				<>
					<Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
						<Avatar
							sx={{ bgcolor: "primary.main", width: 40, height: 40, mr: 2 }}>
							{createImage()}
						</Avatar>
						<Box>
							<Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
								{user.username}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{user.email}
							</Typography>
						</Box>
					</Box>
					<Divider />
				</>
			)}
			<List>
				{filteredMenuItems.map((item) => {
					const isActive = pathname === item.path;

					if (item.submenu) {
						return (
							<Box key={item.text}>
								<ListItem disablePadding>
									<ListItemButton
										onClick={() => handleNavigation(item.path)}
										sx={{
											backgroundColor: isActive
												? "primary.main"
												: "transparent",
											color: isActive ? "primary.contrastText" : "inherit",
											"&:hover": {
												backgroundColor: isActive
													? "primary.dark"
													: "action.hover"
											}
										}}>
										<ListItemIcon
											sx={{
												color: isActive ? "primary.contrastText" : "inherit"
											}}>
											{item.icon}
										</ListItemIcon>
										<ListItemText primary={item.text} />
									</ListItemButton>
								</ListItem>
								<List disablePadding>
									{item.submenu.map((subItem) => {
										const isSubActive = pathname === subItem.path;
										return (
											<ListItem key={subItem.text} disablePadding>
												<ListItemButton
													onClick={() => handleNavigation(subItem.path)}
													sx={{
														pl: 4,
														backgroundColor: isSubActive
															? "primary.main"
															: "transparent",
														color: isSubActive
															? "primary.contrastText"
															: "inherit",
														"&:hover": {
															backgroundColor: isSubActive
																? "primary.dark"
																: "action.hover"
														}
													}}>
													<ListItemText primary={subItem.text} />
												</ListItemButton>
											</ListItem>
										);
									})}
								</List>
							</Box>
						);
					}

					return (
						<ListItem key={item.text} disablePadding>
							<ListItemButton
								onClick={() => handleNavigation(item.path)}
								sx={{
									backgroundColor: isActive ? "primary.main" : "transparent",
									color: isActive ? "primary.contrastText" : "inherit",
									"&:hover": {
										backgroundColor: isActive ? "primary.dark" : "action.hover"
									}
								}}>
								<ListItemIcon
									sx={{ color: isActive ? "primary.contrastText" : "inherit" }}>
									{item.icon}
								</ListItemIcon>
								<ListItemText primary={item.text} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
			<Divider />
			{!isLoggedIn && (
				<List>
					<ListItem disablePadding>
						<ListItemButton onClick={() => handleNavigation("/login")}>
							<ListItemIcon>
								<LoginIcon />
							</ListItemIcon>
							<ListItemText primary='Logowanie' />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton onClick={() => handleNavigation("/register")}>
							<ListItemIcon>
								<PersonAddIcon />
							</ListItemIcon>
							<ListItemText primary='Rejestracja' />
						</ListItemButton>
					</ListItem>
				</List>
			)}
		</Box>
	);

	return (
		<>
			<AppBar position='fixed' color='default' elevation={0}>
				<Toolbar>
					{isMobile && (
						<IconButton
							color='inherit'
							aria-label='open drawer'
							edge='start'
							onClick={handleDrawerToggle}
							sx={{ mr: 2 }}>
							<MenuIcon />
						</IconButton>
					)}{" "}
					<Typography
						variant='h6'
						noWrap
						component={MuiLink}
						href='/'
						sx={{
							mr: 2,
							fontWeight: 700,
							color: "inherit",
							textDecoration: "none",
							display: { xs: "none", sm: "block" }
						}}>
						AutoData
					</Typography>
					{!isMobile && isLoggedIn && (
						<Box sx={{ display: "flex", flexGrow: 1 }}>
							{filteredMenuItems.map((item) => {
								const isActive =
									pathname === item.path ||
									(item.submenu &&
										item.submenu.some((sub) => pathname === sub.path));

								if (item.submenu) {
									return (
										<Box key={item.text} sx={{ position: "relative" }}>
											<Button
												color={isActive ? "primary" : "inherit"}
												sx={{
													mx: 0.5,
													fontWeight: isActive ? 600 : 400
												}}
												endIcon={<KeyboardArrowDownIcon />}
												onClick={handleCarsMenuOpen}>
												{item.text}
											</Button>
											<Menu
												anchorEl={carsMenuAnchorEl}
												open={Boolean(carsMenuAnchorEl)}
												onClose={handleCarsMenuClose}
												MenuListProps={{
													"aria-labelledby": "cars-button"
												}}>
												{item.submenu.map((subItem) => (
													<MenuItem
														key={subItem.text}
														onClick={() => handleNavigation(subItem.path)}
														selected={pathname === subItem.path}>
														{subItem.text}
													</MenuItem>
												))}
											</Menu>
										</Box>
									);
								}

								return (
									<Button
										key={item.text}
										color={isActive ? "primary" : "inherit"}
										sx={{
											mx: 0.5,
											display: "flex",
											alignItems: "center",
											gap: 1,
											fontWeight: isActive ? 600 : 400
										}}
										onClick={() => handleNavigation(item.path)}>
										{item.icon}
										{item.text}
									</Button>
								);
							})}
						</Box>
					)}
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Tooltip
							title={
								mode === "light"
									? "Przełącz na tryb ciemny"
									: "Przełącz na tryb jasny"
							}>
							<IconButton onClick={toggleTheme} color='inherit' sx={{ mr: 1 }}>
								{mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
							</IconButton>
						</Tooltip>

						{isLoggedIn && user ? (
							<>
								<Tooltip title='Konto'>
									<IconButton
										onClick={handleUserMenuOpen}
										color='inherit'
										size='small'
										sx={{ ml: 1 }}
										aria-controls='menu-appbar'
										aria-haspopup='true'>
										<Avatar
											sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
											{createImage()}
										</Avatar>
									</IconButton>
								</Tooltip>
								<Menu
									id='menu-appbar'
									anchorEl={userMenuAnchorEl}
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "right"
									}}
									keepMounted
									transformOrigin={{
										vertical: "top",
										horizontal: "right"
									}}
									open={Boolean(userMenuAnchorEl)}
									onClose={handleUserMenuClose}>
									<MenuItem onClick={() => navigation("/account")}>
										Moje konto
									</MenuItem>
									<MenuItem onClick={handleLogout}>
										<LogoutIcon fontSize='small' sx={{ mr: 1 }} />
										Wyloguj
									</MenuItem>
								</Menu>
							</>
						) : (
							<>
								{!isSmall && (
									<Button
										color='primary'
										variant='outlined'
										startIcon={<LoginIcon />}
										onClick={() => navigation("/login")}
										sx={{ mr: 1 }}>
										Logowanie
									</Button>
								)}
								<Button
									color='primary'
									variant='contained'
									startIcon={isSmall ? null : <PersonAddIcon />}
									onClick={() => navigation("/register")}>
									{isSmall ? <PersonAddIcon /> : "Rejestracja"}
								</Button>
							</>
						)}
					</Box>
				</Toolbar>
			</AppBar>

			<Drawer
				variant='temporary'
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true
				}}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 }
				}}>
				{drawer}
			</Drawer>
		</>
	);
};

export default Navbar;
