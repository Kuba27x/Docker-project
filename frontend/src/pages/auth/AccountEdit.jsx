import { useState, useEffect } from "react";
import {
	Grid,
	Typography,
	Avatar,
	Box,
	Chip,
	Button,
	CircularProgress,
	Divider,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	TextField,
	InputAdornment,
	IconButton
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SecurityIcon from "@mui/icons-material/Security";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import WarningIcon from "@mui/icons-material/Warning";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PageHeader from "../../ui/PageHeader";
import DataCard from "../../ui/DataCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
	const navigate = useNavigate();
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: ""
	});
	const [profileForm, setProfileForm] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: ""
	});
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [confirmDeleteText, setConfirmDeleteText] = useState("");
	const [loading, setLoading] = useState(false);
	const { getToken, refreshUser } = useAuth();

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			try {
				const headers = {
					Authorization: `Token ${getToken()}`
				};

				const response = await axios.get(
					"http://localhost:8000/api/users/me/",
					{
						headers
					}
				);
				const safeData = {
					firstName: response.data.firstName ?? "",
					lastName: response.data.lastName ?? "",
					username: response.data.username ?? "",
					email: response.data.email ?? ""
				};
				setUserData(safeData);
				setProfileForm(safeData);
			} catch (err) {
				console.error("Data fetch error:", err);
				setErrors("Błąd podczas pobierania danych. Spróbuj ponownie później.");
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [getToken]);

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	});

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [errors, setErrors] = useState({});
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleProfileFormChange = (e) => {
		const { name, value } = e.target;
		setProfileForm((prev) => ({
			...prev,
			[name]: value ?? ""
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: ""
			}));
		}
	};

	const handlePasswordFormChange = (e) => {
		const { name, value } = e.target;
		setPasswordForm((prev) => ({
			...prev,
			[name]: value
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: ""
			}));
		}
	};

	const validateProfileForm = () => {
		const newErrors = {};

		if (!profileForm.firstName.trim()) {
			newErrors.firstName = "Imię jest wymagane";
		}

		if (!profileForm.lastName.trim()) {
			newErrors.lastName = "Nazwisko jest wymagane";
		}

		if (!profileForm.username.trim()) {
			newErrors.username = "Nazwa użytkownika jest wymagana";
		} else if (profileForm.username.length < 3) {
			newErrors.username = "Nazwa użytkownika musi mieć co najmniej 3 znaki";
		}

		if (!profileForm.email.trim()) {
			newErrors.email = "Email jest wymagany";
		} else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
			newErrors.email = "Nieprawidłowy format email";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validatePasswordForm = () => {
		const newErrors = {};

		if (!passwordForm.currentPassword) {
			newErrors.currentPassword = "Aktualne hasło jest wymagane";
		}

		if (!passwordForm.newPassword) {
			newErrors.newPassword = "Nowe hasło jest wymagane";
		} else if (passwordForm.newPassword.length < 6) {
			newErrors.newPassword = "Hasło musi mieć co najmniej 6 znaków";
		}

		if (!passwordForm.confirmPassword) {
			newErrors.confirmPassword = "Potwierdzenie hasła jest wymagane";
		} else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			newErrors.confirmPassword = "Hasła nie są identyczne";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSaveProfile = async () => {
		if (!validateProfileForm()) return;

		try {
			const headers = {
				Authorization: `Token ${getToken()}`
			};

			// Prepare only changed fields
			const payload = {};
			if (profileForm.username !== userData.username) {
				payload.username = profileForm.username;
			}
			if (profileForm.email !== userData.email) {
				payload.email = profileForm.email;
			}
			if (profileForm.firstName !== userData.firstName) {
				payload.first_name = profileForm.firstName;
			}
			if (profileForm.lastName !== userData.lastName) {
				payload.last_name = profileForm.lastName;
			}

			await axios.put("http://localhost:8000/api/users/me/", payload, {
				headers
			});

			setUserData((prev) => ({
				...prev,
				...profileForm
			}));

			setIsEditingProfile(false);
			setSuccessMessage("Dane profilu zostały zaktualizowane pomyślnie!");
			setErrorMessage("");

			setTimeout(() => setSuccessMessage(""), 2000);
		} catch (error) {
			setErrorMessage("Wystąpił błąd podczas zapisywania danych");
			setSuccessMessage("");
		}
	};

	const handleChangePassword = async () => {
		if (!validatePasswordForm()) return;

		try {
			const headers = {
				Authorization: `Token ${getToken()}`
			};

			await axios.put(
				"http://localhost:8000/api/users/change-password/",
				{
					current_password: passwordForm.currentPassword,
					new_password: passwordForm.newPassword
				},
				{
					headers
				}
			);

			setPasswordForm({
				currentPassword: "",
				newPassword: "",
				confirmPassword: ""
			});

			setIsChangingPassword(false);
			setSuccessMessage("Hasło zostało zmienione pomyślnie!");
			setErrorMessage("");

			setTimeout(() => setSuccessMessage(""), 5000);
		} catch (error) {
			setErrorMessage("Wystąpił błąd podczas zmiany hasła");
			setSuccessMessage("");
		}
	};

	const handleDeleteAccount = async () => {
		if (confirmDeleteText !== "USUŃ KONTO") {
			setErrors({
				confirmDelete: "Wpisz dokładnie 'USUŃ KONTO' aby potwierdzić"
			});
			return;
		}

		try {
			const headers = {
				Authorization: `Token ${getToken()}`
			};

			await axios.delete("http://localhost:8000/api/users/me/", {
				headers
			});

			localStorage.removeItem("token");
			localStorage.removeItem("user");
			refreshUser();
			navigate("/", { replace: true });
		} catch (error) {
			setErrorMessage("Wystąpił błąd podczas usuwania konta");
		}
	};

	const cancelProfileEdit = () => {
		setProfileForm({
			firstName: userData.firstName,
			lastName: userData.lastName,
			username: userData.username,
			email: userData.email
		});
		setIsEditingProfile(false);
		setErrors({});
	};

	const cancelPasswordChange = () => {
		setPasswordForm({
			currentPassword: "",
			newPassword: "",
			confirmPassword: ""
		});
		setIsChangingPassword(false);
		setErrors({});
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "50vh"
				}}>
				<CircularProgress />
				<Typography variant='h6' sx={{ ml: 2 }}>
					Ładowanie danych...
				</Typography>
			</Box>
		);
	}

	return (
		<>
			<PageHeader
				title='Mój Profil'
				breadcrumbs={[
					{ label: "Pulpit", href: "/dashboard" },
					{ label: "Profil" }
				]}
			/>

			{successMessage && (
				<Alert severity='success' sx={{ mb: 3 }}>
					{successMessage}
				</Alert>
			)}

			{errorMessage && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{errorMessage}
				</Alert>
			)}

			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<DataCard title='Informacje o profilu'>
						<Box sx={{ p: 3, textAlign: "center" }}>
							<Avatar
								sx={{
									width: 120,
									height: 120,
									mx: "auto",
									mb: 2,
									bgcolor: "primary.main",
									fontSize: "3rem"
								}}>
								{userData.firstName && userData.firstName.length > 0
									? userData.firstName.charAt(0).toLocaleUpperCase()
									: userData.username && userData.username.length > 0
									? userData.username.charAt(0).toLocaleUpperCase()
									: "?"}
								{userData.lastName && userData.lastName.length > 0
									? userData.lastName.charAt(0).toLocaleUpperCase()
									: userData.username && userData.username.length > 1
									? userData.username.charAt(1).toLocaleUpperCase()
									: ""}
							</Avatar>

							<Typography variant='h5' gutterBottom>
								{userData.firstName} {userData.lastName}
							</Typography>

							<Typography variant='body2' color='text.secondary' gutterBottom>
								{userData.username}
							</Typography>

							<Divider sx={{ my: 2 }} />

							<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between"
									}}>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
										<Typography variant='body2'>{userData.email}</Typography>
									</Box>
								</Box>
							</Box>
						</Box>
					</DataCard>
				</Grid>

				<Grid item xs={12} md={8}>
					<DataCard
						title='Dane osobowe'
						action={
							!isEditingProfile && (
								<Button
									variant='outlined'
									startIcon={<EditIcon />}
									onClick={() => setIsEditingProfile(true)}>
									Edytuj
								</Button>
							)
						}>
						<Box sx={{ p: 3 }}>
							{!isEditingProfile ? (
								<Grid container spacing={3}>
									<Grid item xs={12} sm={6}>
										<Box>
											<Typography variant='subtitle2' color='text.secondary'>
												Imię
											</Typography>
											<Typography variant='body1'>
												{userData.firstName || "Brak danych"}
											</Typography>
										</Box>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Box>
											<Typography variant='subtitle2' color='text.secondary'>
												Nazwisko
											</Typography>
											<Typography variant='body1'>
												{userData.lastName || "Brak danych"}
											</Typography>
										</Box>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Box>
											<Typography variant='subtitle2' color='text.secondary'>
												Nazwa użytkownika
											</Typography>
											<Typography variant='body1'>
												{userData.username}
											</Typography>
										</Box>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Box>
											<Typography variant='subtitle2' color='text.secondary'>
												Email
											</Typography>
											<Typography variant='body1'>{userData.email}</Typography>
										</Box>
									</Grid>
								</Grid>
							) : (
								<Grid container spacing={3}>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Imię'
											name='firstName'
											value={profileForm.firstName}
											onChange={handleProfileFormChange}
											error={!!errors.firstName}
											helperText={errors.firstName}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Nazwisko'
											name='lastName'
											value={profileForm.lastName}
											onChange={handleProfileFormChange}
											error={!!errors.lastName}
											helperText={errors.lastName}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Nazwa użytkownika'
											name='username'
											value={profileForm.username}
											onChange={handleProfileFormChange}
											error={!!errors.username}
											helperText={errors.username}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Email'
											name='email'
											type='email'
											value={profileForm.email}
											onChange={handleProfileFormChange}
											error={!!errors.email}
											helperText={errors.email}
										/>
									</Grid>
									<Grid item xs={12}>
										<Box
											sx={{
												display: "flex",
												gap: 2,
												justifyContent: "flex-end"
											}}>
											<Button
												variant='outlined'
												startIcon={<CancelIcon />}
												onClick={cancelProfileEdit}>
												Anuluj
											</Button>
											<Button
												variant='contained'
												startIcon={<SaveIcon />}
												onClick={handleSaveProfile}>
												Zapisz zmiany
											</Button>
										</Box>
									</Grid>
								</Grid>
							)}
						</Box>
					</DataCard>
				</Grid>

				<Grid item xs={12} md={6}>
					<DataCard
						title='Bezpieczeństwo'
						action={
							!isChangingPassword && (
								<Button
									variant='outlined'
									startIcon={<SecurityIcon />}
									onClick={() => setIsChangingPassword(true)}>
									Zmień hasło
								</Button>
							)
						}>
						<Box sx={{ p: 3 }}>
							{!isChangingPassword ? (
								<Box>
									<Typography variant='body2'>
										Regularna zmiana hasła zwiększa bezpieczeństwo Twojego
										konta.
									</Typography>
								</Box>
							) : (
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label='Aktualne hasło'
											name='currentPassword'
											type={showCurrentPassword ? "text" : "password"}
											value={passwordForm.currentPassword}
											onChange={handlePasswordFormChange}
											error={!!errors.currentPassword}
											helperText={errors.currentPassword}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<IconButton
															onClick={() =>
																setShowCurrentPassword(!showCurrentPassword)
															}
															edge='end'>
															{showCurrentPassword ? (
																<VisibilityOff />
															) : (
																<Visibility />
															)}
														</IconButton>
													</InputAdornment>
												)
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label='Nowe hasło'
											name='newPassword'
											type={showNewPassword ? "text" : "password"}
											value={passwordForm.newPassword}
											onChange={handlePasswordFormChange}
											error={!!errors.newPassword}
											helperText={errors.newPassword}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<IconButton
															onClick={() =>
																setShowNewPassword(!showNewPassword)
															}
															edge='end'>
															{showNewPassword ? (
																<VisibilityOff />
															) : (
																<Visibility />
															)}
														</IconButton>
													</InputAdornment>
												)
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label='Potwierdź nowe hasło'
											name='confirmPassword'
											type={showConfirmPassword ? "text" : "password"}
											value={passwordForm.confirmPassword}
											onChange={handlePasswordFormChange}
											error={!!errors.confirmPassword}
											helperText={errors.confirmPassword}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<IconButton
															onClick={() =>
																setShowConfirmPassword(!showConfirmPassword)
															}
															edge='end'>
															{showConfirmPassword ? (
																<VisibilityOff />
															) : (
																<Visibility />
															)}
														</IconButton>
													</InputAdornment>
												)
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<Box
											sx={{
												display: "flex",
												gap: 2,
												justifyContent: "flex-end"
											}}>
											<Button
												variant='outlined'
												startIcon={<CancelIcon />}
												onClick={cancelPasswordChange}>
												Anuluj
											</Button>
											<Button
												variant='contained'
												startIcon={<SecurityIcon />}
												onClick={handleChangePassword}>
												Zmień hasło
											</Button>
										</Box>
									</Grid>
								</Grid>
							)}
						</Box>
					</DataCard>
				</Grid>

				{/* Strefa niebezpieczna */}
				<Grid item xs={12} md={6}>
					<DataCard title='Strefa niebezpieczna'>
						<Box sx={{ p: 3 }}>
							<Alert severity='warning' sx={{ mb: 3 }}>
								<Typography variant='subtitle2' gutterBottom>
									Uwaga!
								</Typography>
								<Typography variant='body2'>
									Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane, w
									tym samochody i statystyki, zostaną trwale usunięte.
								</Typography>
							</Alert>

							<Button
								variant='outlined'
								color='error'
								startIcon={<DeleteIcon />}
								onClick={() => setDeleteDialogOpen(true)}
								fullWidth>
								Usuń konto
							</Button>
						</Box>
					</DataCard>
				</Grid>
			</Grid>

			<Dialog
				open={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				maxWidth='sm'
				fullWidth>
				<DialogTitle sx={{ display: "flex", alignItems: "center" }}>
					<WarningIcon color='error' sx={{ mr: 1 }} />
					Potwierdzenie usunięcia konta
				</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ mb: 3 }}>
						Ta operacja jest <strong>nieodwracalna</strong>. Wszystkie Twoje
						dane zostaną trwale usunięte, w tym:
					</DialogContentText>
					<Box component='ul' sx={{ pl: 2, mb: 3 }}>
						<li>Wszystkie dodane samochody</li>
						<li>Historia i statystyki</li>
						<li>Dane osobowe i preferencje</li>
					</Box>
					<DialogContentText sx={{ mb: 3 }}>
						Aby potwierdzić usunięcie konta, wpisz dokładnie:{" "}
						<strong>USUŃ KONTO</strong>
					</DialogContentText>
					<TextField
						fullWidth
						label='Potwierdzenie'
						value={confirmDeleteText}
						onChange={(e) => setConfirmDeleteText(e.target.value)}
						error={!!errors.confirmDelete}
						helperText={errors.confirmDelete}
						placeholder='USUŃ KONTO'
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setDeleteDialogOpen(false);
							setConfirmDeleteText("");
							setErrors({});
						}}>
						Anuluj
					</Button>
					<Button
						onClick={handleDeleteAccount}
						color='error'
						variant='contained'
						disabled={confirmDeleteText !== "USUŃ KONTO"}>
						Usuń konto na zawsze
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
