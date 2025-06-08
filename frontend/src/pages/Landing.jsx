import {
	Box,
	Button,
	Container,
	Typography,
	Grid,
	Card,
	Link as MuiLink,
	CardContent,
	TextField,
	InputAdornment,
	useTheme,
	Paper,
	Avatar,
	Chip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import DevicesIcon from "@mui/icons-material/Devices";
import EmailIcon from "@mui/icons-material/Email";
import { useTheme as useAppTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";

const Landing = () => {
	const theme = useTheme();
	const { mode } = useAppTheme();

	const features = [
		{
			icon: <DirectionsCarIcon fontSize='large' />,
			title: "Kompleksowe zarządzanie",
			description:
				"Łatwe dodawanie, edytowanie i zarządzanie danymi pojazdów w jednym miejscu.",
			color: "primary.main"
		},
		{
			icon: <BarChartIcon fontSize='large' />,
			title: "Zaawansowane statystyki",
			description:
				"Analizuj dane pojazdów za pomocą przejrzystych wykresów i raportów.",
			color: "secondary.main"
		},
		{
			icon: <CloudUploadIcon fontSize='large' />,
			title: "Import danych",
			description: "Szybki import danych z plików CSV i innych formatów.",
			color: "info.main"
		},
		{
			icon: <SpeedIcon fontSize='large' />,
			title: "Wydajne wyszukiwanie",
			description: "Zaawansowane filtry i szybkie wyszukiwanie pojazdów.",
			color: "warning.main"
		},
		{
			icon: <SecurityIcon fontSize='large' />,
			title: "Bezpieczeństwo danych",
			description: "Pełne bezpieczeństwo i ochrona wprowadzonych danych.",
			color: "error.main"
		},
		{
			icon: <DevicesIcon fontSize='large' />,
			title: "Dostęp z każdego urządzenia",
			description: "Responsywny interfejs dostosowany do wszystkich urządzeń.",
			color: "success.main"
		}
	];

	const testimonials = [
		{
			name: "Jan Kowalski",
			role: "Właściciel komisu samochodowego",
			content:
				"AutoData zrewolucjonizowało sposób, w jaki zarządzam swoim komisem. Wszystkie dane są teraz uporządkowane i łatwo dostępne.",
			avatar: "JK"
		},
		{
			name: "Anna Nowak",
			role: "Menedżer floty",
			content:
				"Dzięki AutoData zaoszczędziliśmy mnóstwo czasu na zarządzaniu flotą firmową. Statystyki i raporty są nieocenione.",
			avatar: "AN"
		},
		{
			name: "Piotr Wiśniewski",
			role: "Pasjonat motoryzacji",
			content:
				"Jako kolekcjoner samochodów, AutoData pomaga mi śledzić wszystkie szczegóły mojej kolekcji. Polecam każdemu entuzjaście!",
			avatar: "PW"
		}
	];

	return (
		<Box sx={{ overflow: "hidden" }}>
			<Box
				sx={{
					position: "relative",
					bgcolor: "background.paper",
					pt: { xs: 8, md: 12 },
					pb: { xs: 10, md: 16 }
				}}>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						overflow: "hidden",
						zIndex: 0
					}}>
					<Box
						sx={{
							position: "absolute",
							top: -100,
							right: -100,
							width: 400,
							height: 400,
							borderRadius: "50%",
							background: `radial-gradient(circle, ${theme.palette.primary.main}20, ${theme.palette.primary.main}05)`
						}}
					/>
					<Box
						sx={{
							position: "absolute",
							bottom: -150,
							left: -150,
							width: 500,
							height: 500,
							borderRadius: "50%",
							background: `radial-gradient(circle, ${theme.palette.secondary.main}20, ${theme.palette.secondary.main}05)`
						}}
					/>
				</Box>

				<Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
					<Grid container spacing={4} alignItems='center'>
						<Grid item xs={12} md={6}>
							<Box sx={{ textAlign: { xs: "center", md: "left" } }}>
								<Typography
									variant='h2'
									component='h1'
									gutterBottom
									sx={{
										fontWeight: 800,
										fontSize: { xs: "2.5rem", md: "3.5rem" },
										background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										mb: 2
									}}>
									Zarządzaj danymi samochodów z łatwością
								</Typography>
								<Typography
									variant='h5'
									color='text.secondary'
									paragraph
									sx={{ mb: 4 }}>
									AutoData to kompleksowe narzędzie do zarządzania, analizowania
									i śledzenia danych pojazdów. Wszystko, czego potrzebujesz, w
									jednym miejscu.
								</Typography>
								<Box
									sx={{
										display: "flex",
										flexDirection: { xs: "column", sm: "row" },
										gap: 2,
										justifyContent: { xs: "center", md: "flex-start" }
									}}>
									<Button
										variant='contained'
										size='large'
										component={MuiLink}
										href='/register'
										sx={{ py: 1.5, px: 3, borderRadius: 2 }}>
										Rozpocznij za darmo
									</Button>
									<Button
										variant='outlined'
										size='large'
										component={MuiLink}
										href='/login'
										sx={{ py: 1.5, px: 3, borderRadius: 2 }}>
										Zaloguj się
									</Button>
								</Box>
								<Box
									sx={{
										mt: 4,
										display: "flex",
										flexWrap: "wrap",
										justifyContent: { xs: "center", md: "flex-start" }
									}}>
									<Chip
										icon={<CheckCircleIcon />}
										label='Bez karty kredytowej'
										variant='outlined'
										sx={{ mr: 1 }}
									/>
									<Chip
										icon={<CheckCircleIcon />}
										label='14 dni za darmo'
										variant='outlined'
										sx={{ mr: 1 }}
									/>
									<Chip
										icon={<CheckCircleIcon />}
										label='Wsparcie 24/7'
										variant='outlined'
									/>
								</Box>
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box
								sx={{
									position: "relative",
									height: { xs: 300, md: 400 },
									width: "100%",
									display: "flex",
									justifyContent: "center",
									alignItems: "center"
								}}>
								<Box
									component='img'
									src='/images/dashboard.jpg'
									alt='Panel sterowania'
									sx={{
										width: { xs: "100%", sm: "90%", md: "80%", lg: "100%" },
										maxWidth: 700,
										height: "auto",
										borderRadius: 4,
										boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
										border: "1px solid",
										borderColor: "divider",
										objectFit: "contain"
									}}
								/>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Box sx={{ bgcolor: mode === "light" ? "grey.100" : "grey.900", py: 6 }}>
				<Container maxWidth='lg'>
					<Grid container spacing={3} justifyContent='center'>
						<Grid item xs={6} md={3}>
							<Box sx={{ textAlign: "center" }}>
								<Typography
									variant='h3'
									component='div'
									sx={{ fontWeight: 700, color: "primary.main" }}>
									10,000+
								</Typography>
								<Typography variant='subtitle1' color='text.secondary'>
									Użytkowników
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={6} md={3}>
							<Box sx={{ textAlign: "center" }}>
								<Typography
									variant='h3'
									component='div'
									sx={{ fontWeight: 700, color: "secondary.main" }}>
									500,000+
								</Typography>
								<Typography variant='subtitle1' color='text.secondary'>
									Pojazdów
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={6} md={3}>
							<Box sx={{ textAlign: "center" }}>
								<Typography
									variant='h3'
									component='div'
									sx={{ fontWeight: 700, color: "info.main" }}>
									98%
								</Typography>
								<Typography variant='subtitle1' color='text.secondary'>
									Zadowolonych klientów
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={6} md={3}>
							<Box sx={{ textAlign: "center" }}>
								<Typography
									variant='h3'
									component='div'
									sx={{ fontWeight: 700, color: "success.main" }}>
									24/7
								</Typography>
								<Typography variant='subtitle1' color='text.secondary'>
									Wsparcie techniczne
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 8, md: 12 } }}>
				<Container maxWidth='lg'>
					<Box sx={{ textAlign: "center", mb: 8 }}>
						<Typography
							variant='overline'
							component='div'
							color='primary'
							sx={{ fontWeight: 600, mb: 1 }}>
							FUNKCJONALNOŚCI
						</Typography>
						<Typography
							variant='h3'
							component='h2'
							sx={{ fontWeight: 700, mb: 2 }}>
							Wszystko, czego potrzebujesz
						</Typography>
						<Typography
							variant='h6'
							color='text.secondary'
							sx={{ maxWidth: 700, mx: "auto" }}>
							AutoData oferuje kompleksowe narzędzia do zarządzania danymi
							pojazdów, które pomogą Ci zaoszczędzić czas i podejmować lepsze
							decyzje.
						</Typography>
					</Box>

					<Grid container spacing={4}>
						{features.map((feature, index) => (
							<Grid item xs={12} sm={6} md={4} key={index}>
								<Card
									elevation={0}
									sx={{
										height: "100%",
										borderRadius: 4,
										transition: "transform 0.3s, box-shadow 0.3s",
										"&:hover": {
											transform: "translateY(-5px)",
											boxShadow: 4
										},
										border: "1px solid",
										borderColor: "divider"
									}}>
									<CardContent sx={{ p: 4 }}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: 70,
												height: 70,
												borderRadius: "50%",
												bgcolor: `${feature.color}15`,
												color: feature.color,
												mb: 2
											}}>
											{feature.icon}
										</Box>
										<Typography
											variant='h5'
											component='h3'
											gutterBottom
											sx={{ fontWeight: 600 }}>
											{feature.title}
										</Typography>
										<Typography variant='body1' color='text.secondary'>
											{feature.description}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

			<Box
				sx={{
					bgcolor: mode === "light" ? "grey.50" : "grey.900",
					py: { xs: 8, md: 12 }
				}}>
				<Container maxWidth='lg'>
					<Box sx={{ textAlign: "center", mb: 8 }}>
						<Typography
							variant='overline'
							component='div'
							color='primary'
							sx={{ fontWeight: 600, mb: 1 }}>
							JAK TO DZIAŁA
						</Typography>
						<Typography
							variant='h3'
							component='h2'
							sx={{ fontWeight: 700, mb: 2 }}>
							Prosta droga do efektywnego zarządzania
						</Typography>
						<Typography
							variant='h6'
							color='text.secondary'
							sx={{ maxWidth: 700, mx: "auto" }}>
							Rozpocznij pracę z AutoData w kilku prostych krokach i odkryj nowy
							wymiar zarządzania danymi pojazdów.
						</Typography>
					</Box>

					<Grid container spacing={5} alignItems='center'>
						<Grid item xs={12} md={6}>
							<Box
								component='img'
								src='/images/how-it-works.jpg'
								alt='Jak to działa'
								sx={{
									width: "100%",
									height: "auto",
									borderRadius: 4,
									boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
									border: "1px solid",
									borderColor: "divider"
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box>
								<Box sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 50,
											height: 50,
											borderRadius: "50%",
											bgcolor: "primary.main",
											color: "white",
											fontWeight: "bold",
											mr: 2,
											flexShrink: 0
										}}>
										1
									</Box>
									<Box>
										<Typography
											variant='h5'
											component='h3'
											gutterBottom
											sx={{ fontWeight: 600 }}>
											Utwórz konto
										</Typography>
										<Typography variant='body1' color='text.secondary'>
											Zarejestruj się za darmo i skonfiguruj swoje konto w kilka
											minut. Nie wymagamy karty kredytowej.
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 50,
											height: 50,
											borderRadius: "50%",
											bgcolor: "secondary.main",
											color: "white",
											fontWeight: "bold",
											mr: 2,
											flexShrink: 0
										}}>
										2
									</Box>
									<Box>
										<Typography
											variant='h5'
											component='h3'
											gutterBottom
											sx={{ fontWeight: 600 }}>
											Dodaj swoje pojazdy
										</Typography>
										<Typography variant='body1' color='text.secondary'>
											Wprowadź dane pojazdów ręcznie lub zaimportuj je z pliku
											CSV. Nasz system automatycznie zorganizuje wszystkie
											informacje.
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: "flex", alignItems: "flex-start" }}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 50,
											height: 50,
											borderRadius: "50%",
											bgcolor: "info.main",
											color: "white",
											fontWeight: "bold",
											mr: 2,
											flexShrink: 0
										}}>
										3
									</Box>
									<Box>
										<Typography
											variant='h5'
											component='h3'
											gutterBottom
											sx={{ fontWeight: 600 }}>
											Analizuj i zarządzaj
										</Typography>
										<Typography variant='body1' color='text.secondary'>
											Korzystaj z zaawansowanych narzędzi analitycznych, generuj
											raporty i efektywnie zarządzaj swoją flotą lub kolekcją
											pojazdów.
										</Typography>
									</Box>
								</Box>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 8, md: 12 } }}>
				<Container maxWidth='lg'>
					<Box sx={{ textAlign: "center", mb: 8 }}>
						<Typography
							variant='overline'
							component='div'
							color='primary'
							sx={{ fontWeight: 600, mb: 1 }}>
							OPINIE KLIENTÓW
						</Typography>
						<Typography
							variant='h3'
							component='h2'
							sx={{ fontWeight: 700, mb: 2 }}>
							Co mówią nasi użytkownicy
						</Typography>
						<Typography
							variant='h6'
							color='text.secondary'
							sx={{ maxWidth: 700, mx: "auto" }}>
							Dołącz do tysięcy zadowolonych użytkowników, którzy już korzystają
							z AutoData do zarządzania swoimi pojazdami.
						</Typography>
					</Box>

					<Grid container spacing={4}>
						{testimonials.map((testimonial, index) => (
							<Grid item xs={12} md={4} key={index}>
								<Paper
									elevation={0}
									sx={{
										p: 4,
										height: "100%",
										borderRadius: 4,
										border: "1px solid",
										borderColor: "divider",
										display: "flex",
										flexDirection: "column"
									}}>
									<Typography
										variant='body1'
										paragraph
										sx={{ flex: 1, fontStyle: "italic" }}>
										"{testimonial.content}"
									</Typography>
									<Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
										<Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
											{testimonial.avatar}
										</Avatar>
										<Box>
											<Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
												{testimonial.name}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												{testimonial.role}
											</Typography>
										</Box>
									</Box>
								</Paper>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

			<Box
				sx={{
					bgcolor: "primary.main",
					color: "primary.contrastText",
					py: { xs: 8, md: 12 },
					position: "relative",
					overflow: "hidden"
				}}>
				<Box
					sx={{
						position: "absolute",
						top: -100,
						right: -100,
						width: 400,
						height: 400,
						borderRadius: "50%",
						background: "rgba(255, 255, 255, 0.1)"
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						bottom: -150,
						left: -150,
						width: 500,
						height: 500,
						borderRadius: "50%",
						background: "rgba(255, 255, 255, 0.05)"
					}}
				/>

				<Container maxWidth='md' sx={{ position: "relative", zIndex: 1 }}>
					<Box sx={{ textAlign: "center" }}>
						<Typography
							variant='h3'
							component='h2'
							gutterBottom
							sx={{ fontWeight: 700 }}>
							Gotowy, by zacząć?
						</Typography>
						<Typography variant='h6' paragraph sx={{ mb: 4, opacity: 0.9 }}>
							Dołącz do tysięcy użytkowników, którzy już korzystają z AutoData.
							Zarejestruj się za darmo i odkryj nowy wymiar zarządzania danymi
							pojazdów.
						</Typography>

						<Box
							component='form'
							sx={{
								display: "flex",
								flexDirection: { xs: "column", sm: "row" },
								gap: 2,
								maxWidth: 500,
								mx: "auto",
								mb: 4
							}}>
							<TextField
								fullWidth
								placeholder='Twój adres email'
								variant='outlined'
								disabled
								sx={{
									bgcolor: "background.paper",
									borderRadius: 2,
									"& .MuiOutlinedInput-root": {
										borderRadius: 2
									}
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<EmailIcon color='action' />
										</InputAdornment>
									)
								}}
							/>
							<Button
								variant='contained'
								color='secondary'
								component={MuiLink}
								href='/register'
								size='large'
								sx={{
									py: 1.5,
									px: 4,
									borderRadius: 2,
									whiteSpace: "nowrap"
								}}>
								Rozpocznij za darmo
							</Button>
						</Box>

						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								gap: 3,
								flexWrap: "wrap"
							}}>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
								<Typography variant='body2'>Bez karty kredytowej</Typography>
							</Box>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
								<Typography variant='body2'>14 dni za darmo</Typography>
							</Box>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
								<Typography variant='body2'>
									Anuluj w dowolnym momencie
								</Typography>
							</Box>
						</Box>
					</Box>
				</Container>
			</Box>
			<Footer />
		</Box>
	);
};

export default Landing;
