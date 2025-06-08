import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	TextField,
	Button,
	Typography,
	Box,
	Paper,
	InputAdornment,
	IconButton,
	Divider,
	Alert,
	Link as MuiLink
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { login, refreshUser } = useAuth();

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const response = await axios.post("http://localhost:8000/api/login/", {
				username,
				password
			});

			login(response.data.token);
			localStorage.setItem(
				"user",
				JSON.stringify({
					id: response.data.user_id,
					username: response.data.username
				})
			);

			if (refreshUser) refreshUser();
			navigate("/dashboard", { replace: true });
		} catch (error) {
			setError("Nieprawidłowa nazwa użytkownika lub hasło");
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "calc(100vh - 150px)"
			}}>
			<Paper
				elevation={0}
				sx={{
					p: 4,
					maxWidth: "450px",
					width: "100%",
					borderRadius: 3
				}}>
				{" "}
				<Box sx={{ textAlign: "center", mb: 4 }}>
					<Typography
						variant='h4'
						component='h1'
						gutterBottom
						sx={{ fontWeight: 700 }}>
						Witaj ponownie!
					</Typography>
					<Typography variant='body1' color='text.secondary'>
						Zaloguj się, aby kontynuować pracę
					</Typography>
				</Box>
				{error && (
					<Alert severity='error' sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}
				<Box component='form' onSubmit={handleSubmit}>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='username'
						label='Nazwa użytkownika'
						name='username'
						autoComplete='username'
						autoFocus
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						name='password'
						label='Hasło'
						type={showPassword ? "text" : "password"}
						id='password'
						autoComplete='current-password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowPassword}
										edge='end'>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
					<Box sx={{ textAlign: "right", mt: 1 }}>
						<Link href='#' style={{ textDecoration: "none" }}>
							<Typography variant='body2' color='primary'>
								Zapomniałeś hasła?
							</Typography>
						</Link>
					</Box>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						size='large'
						sx={{ mt: 3, mb: 2, py: 1.5 }}
						startIcon={<LoginIcon />}>
						Zaloguj się
					</Button>

					<Box sx={{ textAlign: "center", mt: 2 }}>
						<Typography variant='body2' color='text.secondary'>
							Nie masz konta?{" "}
							<MuiLink
								href='/register'
								style={{ textDecoration: "none", color: "primary.main" }}>
								Zarejestruj się
							</MuiLink>
						</Typography>
					</Box>

					<Box sx={{ mt: 4, mb: 2 }}>
						<Divider>
							<Typography variant='body2' color='text.secondary'>
								Lub zaloguj się przez
							</Typography>
						</Divider>
					</Box>

					<Box sx={{ display: "flex", gap: 2 }}>
						<Button
							fullWidth
							variant='outlined'
							color='inherit'
							startIcon={<GoogleIcon />}
							sx={{ py: 1.5 }}>
							Google
						</Button>
						<Button
							fullWidth
							variant='outlined'
							color='inherit'
							startIcon={<FacebookIcon />}
							sx={{ py: 1.5 }}>
							Facebook
						</Button>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};

export default Login;
