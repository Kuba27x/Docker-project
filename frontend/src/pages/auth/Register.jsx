import {
	TextField,
	Button,
	Typography,
	Box,
	Paper,
	Alert,
	InputAdornment,
	IconButton,
	Divider,
	Stepper,
	Step,
	StepLabel,
	useMediaQuery,
	useTheme,
	StepContent,
	StepButton
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Register = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const navigate = useNavigate();
	const { login, refreshUser } = useAuth();

	const steps = [
		{
			label: "Dane konta",
			icon: <AccountCircleIcon />,
			description: "Podaj dane logowania do konta"
		},
		{
			label: "Dane osobowe",
			icon: <PersonIcon />,
			description: "Uzupełnij swoje dane osobowe"
		},
		{
			label: "Potwierdzenie",
			icon: <CheckCircleIcon />,
			description: "Sprawdź i potwierdź dane"
		}
	];

	const handleNext = () => {
		if (activeStep === 0) {
			if (!username || !email || !password || !confirmPassword) {
				setError("Wszystkie pola są wymagane");
				return;
			}
			if (password !== confirmPassword) {
				setError("Hasła nie są identyczne");
				return;
			}
			if (password.length < 6) {
				setError("Hasło musi mieć co najmniej 6 znaków");
				return;
			}
		} else if (activeStep === 1) {
			if (!firstName || !lastName) {
				setError("Imię i nazwisko są wymagane");
				return;
			}
		}

		setError("");
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleStepClick = (step) => {
		if (step < activeStep) {
			setActiveStep(step);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess(false);

		try {
			const response = await axios.post("http://localhost:8000/api/register/", {
				username,
				email,
				password,
				first_name: firstName,
				last_name: lastName
			});

			login(response.data.token);
			setSuccess(true);
			localStorage.setItem("user", JSON.stringify(response.data.user));

			if (refreshUser) refreshUser();
			navigate("/dashboard", { replace: true });
		} catch (error) {
			if (error.response && error.response.data) {
				const data = error.response.data;
				if (typeof data === "object" && data !== null) {
					const messages = Object.values(data).flat().join("\n");
					setError(messages);
				} else {
					setError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
				}
			} else {
				setError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
			}
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<>
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
							id='email'
							label='Adres email'
							name='email'
							autoComplete='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
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
							autoComplete='new-password'
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
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='confirmPassword'
							label='Potwierdź hasło'
							type={showConfirmPassword ? "text" : "password"}
							id='confirmPassword'
							autoComplete='new-password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowConfirmPassword}
											edge='end'>
											{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					</>
				);
			case 1:
				return (
					<>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='firstName'
							label='Imię'
							name='first_name'
							autoComplete='given-name'
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='lastName'
							label='Nazwisko'
							name='last_name'
							autoComplete='family-name'
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</>
				);
			case 2:
				return (
					<Box sx={{ mt: 2 }}>
						<Alert severity='info' sx={{ mb: 3 }}>
							Sprawdź poprawność wprowadzonych danych przed zakończeniem
							rejestracji.
						</Alert>
						<Box sx={{ mb: 3 }}>
							<Typography variant='subtitle1' gutterBottom>
								Dane konta
							</Typography>
							<Box sx={{ pl: 2 }}>
								<Typography variant='body1'>
									<strong>Nazwa użytkownika:</strong> {username}
								</Typography>
								<Typography variant='body1'>
									<strong>Email:</strong> {email}
								</Typography>
							</Box>
						</Box>
						<Box>
							<Typography variant='subtitle1' gutterBottom>
								Dane osobowe
							</Typography>
							<Box sx={{ pl: 2 }}>
								<Typography variant='body1'>
									<strong>Imię:</strong> {firstName}
								</Typography>
								<Typography variant='body1'>
									<strong>Nazwisko:</strong> {lastName}
								</Typography>
							</Box>
						</Box>
					</Box>
				);
			default:
				return "Nieznany krok";
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
					maxWidth: "600px",
					width: "100%",
					borderRadius: 3
				}}>
				<Box sx={{ textAlign: "center", mb: 4 }}>
					<Typography
						variant='h4'
						component='h1'
						gutterBottom
						sx={{ fontWeight: 700 }}>
						Utwórz konto
					</Typography>
					<Typography variant='body1' color='text.secondary'>
						Dołącz do systemu zarządzania danymi samochodowymi
					</Typography>
				</Box>

				{error && (
					<Alert severity='error' sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				{success && (
					<Alert severity='success' sx={{ mb: 3 }}>
						Rejestracja zakończona pomyślnie! Za chwilę zostaniesz przekierowany
						do strony logowania.
					</Alert>
				)}

				<Box sx={{ mb: 4 }}>
					{isMobile ? (
						<Stepper activeStep={activeStep} orientation='vertical'>
							{steps.map((step, index) => (
								<Step key={step.label} completed={activeStep > index}>
									<StepButton onClick={() => handleStepClick(index)}>
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													width: 28,
													height: 28,
													borderRadius: "50%",
													bgcolor:
														activeStep === index
															? "primary.main"
															: "action.disabled",
													color: "white",
													mr: 1,
													fontWeight: "bold"
												}}>
												{index + 1}
											</Box>
											<Typography variant='subtitle1'>{step.label}</Typography>
										</Box>
									</StepButton>
									<StepContent>
										<Typography
											variant='body2'
											color='text.secondary'
											sx={{ mb: 2 }}>
											{step.description}
										</Typography>
										<Box sx={{ mb: 2 }}>{getStepContent(index)}</Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mt: 2
											}}>
											<Button
												variant='outlined'
												disabled={index === 0}
												onClick={handleBack}
												startIcon={<ArrowBackIcon />}>
												Wstecz
											</Button>
											{index === steps.length - 1 ? (
												<Button
													variant='contained'
													color='primary'
													onClick={handleSubmit}
													startIcon={<PersonAddIcon />}
													disabled={success}>
													Zarejestruj się
												</Button>
											) : (
												<Button
													variant='contained'
													color='primary'
													onClick={handleNext}
													endIcon={<ArrowForwardIcon />}>
													Dalej
												</Button>
											)}
										</Box>
									</StepContent>
								</Step>
							))}
						</Stepper>
					) : (
						// Wersja desktopowa - stepper poziomy
						<>
							<Stepper activeStep={activeStep} alternativeLabel>
								{steps.map((step, index) => (
									<Step key={step.label} completed={activeStep > index}>
										<StepButton onClick={() => handleStepClick(index)}>
											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center"
												}}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														width: 32,
														height: 32,
														borderRadius: "50%",
														bgcolor:
															activeStep === index
																? "primary.main"
																: "action.disabled",
														color: "white",
														mb: 1,
														fontWeight: "bold"
													}}>
													{index + 1}
												</Box>
												<StepLabel
													StepIconComponent={() => null}
													sx={{
														"& .MuiStepLabel-label": {
															color:
																activeStep === index
																	? "primary.main"
																	: "text.secondary",
															fontWeight: activeStep === index ? 600 : 400
														}
													}}>
													{step.label}
												</StepLabel>
											</Box>
										</StepButton>
									</Step>
								))}
							</Stepper>

							<Box sx={{ mt: 4, mb: 2 }}>
								<Typography variant='h6' gutterBottom>
									{steps[activeStep].label}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ mb: 3 }}>
									{steps[activeStep].description}
								</Typography>
								<Box component='form' onSubmit={handleSubmit}>
									{getStepContent(activeStep)}
								</Box>
							</Box>

							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									mt: 4
								}}>
								<Button
									variant='outlined'
									onClick={
										activeStep === 0 ? () => navigate("/login") : handleBack
									}
									startIcon={activeStep === 0 ? null : <ArrowBackIcon />}>
									{activeStep === 0 ? "Wróć do logowania" : "Wstecz"}
								</Button>
								{activeStep === steps.length - 1 ? (
									<Button
										variant='contained'
										color='primary'
										onClick={handleSubmit}
										startIcon={<PersonAddIcon />}
										disabled={success}>
										Zarejestruj się
									</Button>
								) : (
									<Button
										variant='contained'
										color='primary'
										onClick={handleNext}
										endIcon={<ArrowForwardIcon />}>
										Dalej
									</Button>
								)}
							</Box>
						</>
					)}
				</Box>

				{activeStep === 0 && (
					<>
						<Box sx={{ mt: 4, mb: 2 }}>
							<Divider>
								<Typography variant='body2' color='text.secondary'>
									Lub zarejestruj się przez
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
					</>
				)}
			</Paper>
		</Box>
	);
};

export default Register;
