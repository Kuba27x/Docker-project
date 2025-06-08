import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { provinces, fuelTypes, fuelTypesValue } from "../data/data";
import {
	Typography,
	TextField,
	Button,
	Grid,
	MenuItem,
	Box,
	Alert,
	Stepper,
	Step,
	StepLabel,
	Paper,
	Divider,
	useMediaQuery,
	useTheme,
	StepButton,
	StepContent,
	CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SaveIcon from "@mui/icons-material/Save";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PageHeader from "../ui/PageHeader";
import DataCard from "../ui/DataCard";
import { useParams } from "react-router-dom";
import { fuelNameConverter } from "../utils/converter";

export const EditCarForm = () => {
	const navigate = useNavigate();
	const { getToken } = useAuth();
	const params = useParams();
	const carId = params.id;
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState({
		mark: "",
		model: "",
		generation_name: "",
		year: "",
		mileage: "",
		vol_engine: "",
		fuel: "",
		city: "",
		province: "",
		price: ""
	});
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState({});
	const [submitError, setSubmitError] = useState("");
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const steps = [
		{
			label: "Dane pojazdu",
			icon: <DirectionsCarIcon />,
			description: "Edytuj podstawowe informacje o pojeździe"
		},
		{
			label: "Lokalizacja",
			icon: <LocationOnIcon />,
			description: "Edytuj lokalizację pojazdu"
		},
		{
			label: "Cena i podsumowanie",
			icon: <AttachMoneyIcon />,
			description: "Edytuj cenę i sprawdź wprowadzone dane"
		}
	];

	useEffect(() => {
		const fetchCars = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`http://localhost:8000/api/cars/${carId}/`,
					{
						headers: {
							Authorization: `Token ${getToken()}`
						}
					}
				);
				setFormData(response.data);
			} catch (err) {
				navigate("/cars", { replace: true });
			} finally {
				setLoading(false);
			}
		};

		fetchCars();
	}, [carId, getToken, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});

		if (errors[name]) {
			setErrors({
				...errors,
				[name]: ""
			});
		}
	};

	const validateStep = (step) => {
		const newErrors = {};

		if (step === 0) {
			if (!formData.mark) newErrors.mark = "Marka jest wymagana";
			if (!formData.model) newErrors.model = "Model jest wymagany";
			if (!formData.year) newErrors.year = "Rok jest wymagany";
			if (!formData.mileage) newErrors.mileage = "Przebieg jest wymagany";
			if (!formData.vol_engine)
				newErrors.vol_engine = "Pojemność silnika jest wymagana";
			if (!formData.fuel) newErrors.fuel = "Rodzaj paliwa jest wymagany";

			if (
				formData.year &&
				(isNaN(formData.year) ||
					Number.parseInt(formData.year) < 1900 ||
					Number.parseInt(formData.year) > new Date().getFullYear() + 1)
			) {
				newErrors.year = "Proszę podać prawidłowy rok";
			}

			if (
				formData.mileage &&
				(isNaN(formData.mileage) || Number.parseInt(formData.mileage) < 0)
			) {
				newErrors.mileage = "Proszę podać prawidłowy przebieg";
			}

			if (
				formData.vol_engine &&
				(isNaN(formData.vol_engine) ||
					Number.parseFloat(formData.vol_engine) <= 0)
			) {
				newErrors.vol_engine = "Proszę podać prawidłową pojemność silnika";
			}
		} else if (step === 1) {
			if (!formData.city) newErrors.city = "Miasto jest wymagane";
			if (!formData.province) newErrors.province = "Województwo jest wymagane";
		} else if (step === 2) {
			if (!formData.price) newErrors.price = "Cena jest wymagana";
			if (
				formData.price &&
				(isNaN(formData.price) || Number.parseFloat(formData.price) < 0)
			) {
				newErrors.price = "Proszę podać prawidłową cenę";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateStep(activeStep)) {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
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
		setSubmitError("");
		setSubmitSuccess(false);

		if (!validateStep(activeStep)) {
			return;
		}

		try {
			await axios.put(`http://localhost:8000/api/cars/${carId}/`, formData, {
				headers: {
					Authorization: `Token ${getToken()}`
				}
			});

			setSubmitSuccess(true);
			setTimeout(() => {
				navigate("/cars");
			}, 2000);
		} catch (error) {
			if (error.response && error.response.data) {
				setSubmitError(JSON.stringify(error.response.data));
			} else {
				setSubmitError("Wystąpił błąd podczas edytowania samochodu");
			}
		}
	};

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								required
								id='mark'
								name='mark'
								label='Marka'
								value={formData.mark}
								onChange={handleChange}
								error={!!errors.mark}
								helperText={errors.mark}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								required
								id='model'
								name='model'
								label='Model'
								value={formData.model}
								onChange={handleChange}
								error={!!errors.model}
								helperText={errors.model}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id='generation_name'
								name='generation_name'
								label='Nazwa Generacji'
								value={formData.generation_name}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								required
								id='year'
								name='year'
								label='Rok'
								type='number'
								value={formData.year}
								onChange={handleChange}
								error={!!errors.year}
								helperText={errors.year}
								inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								required
								id='mileage'
								name='mileage'
								label='Przebieg'
								type='number'
								value={formData.mileage}
								onChange={handleChange}
								error={!!errors.mileage}
								helperText={errors.mileage}
								inputProps={{ min: 0 }}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								required
								id='vol_engine'
								name='vol_engine'
								label='Pojemność Silnika (L)'
								type='number'
								value={formData.vol_engine}
								onChange={handleChange}
								error={!!errors.vol_engine}
								helperText={errors.vol_engine}
								inputProps={{ step: 0.1, min: 0.1 }}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								select
								id='fuel'
								name='fuel'
								label='Rodzaj Paliwa'
								value={formData.fuel.toLowerCase()}
								onChange={handleChange}
								error={!!errors.fuel}
								helperText={errors.fuel || "Wybierz rodzaj paliwa"}>
								{fuelTypes.map((option, index) => (
									<MenuItem key={option} value={fuelTypesValue[index]}>
										{option}
									</MenuItem>
								))}
							</TextField>
						</Grid>
					</Grid>
				);
			case 1:
				return (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								id='city'
								name='city'
								label='Miasto'
								value={formData.city}
								onChange={handleChange}
								error={!!errors.city}
								helperText={errors.city}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								select
								id='province'
								name='province'
								label='Województwo'
								value={formData.province}
								onChange={handleChange}
								error={!!errors.province}
								helperText={errors.province || "Wybierz województwo"}>
								{provinces.map((option) => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</TextField>
						</Grid>
					</Grid>
				);
			case 2:
				return (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								id='price'
								name='price'
								label='Cena (zł)'
								type='number'
								value={formData.price}
								onChange={handleChange}
								error={!!errors.price}
								helperText={errors.price}
								inputProps={{ min: 0 }}
							/>
						</Grid>
						<Grid item xs={12}>
							<Divider sx={{ my: 2 }} />
							<Typography variant='h6' gutterBottom>
								Podsumowanie
							</Typography>
							<Paper sx={{ p: 3, backgroundColor: "background.default" }}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6}>
										<Typography variant='subtitle2' color='text.secondary'>
											Marka i model
										</Typography>
										<Typography variant='body1'>
											{formData.mark} {formData.model}{" "}
											{formData.generation_name &&
												`(${formData.generation_name})`}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Typography variant='subtitle2' color='text.secondary'>
											Rok produkcji
										</Typography>
										<Typography variant='body1'>{formData.year}</Typography>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Typography variant='subtitle2' color='text.secondary'>
											Przebieg
										</Typography>
										<Typography variant='body1'>
											{formData.mileage &&
												`${Number(formData.mileage).toLocaleString()} km`}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Typography variant='subtitle2' color='text.secondary'>
											Silnik
										</Typography>
										<Typography variant='body1'>
											{formData.vol_engine} L,{" "}
											{fuelNameConverter(formData.fuel)}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Typography variant='subtitle2' color='text.secondary'>
											Lokalizacja
										</Typography>
										<Typography variant='body1'>
											{formData.city}, {formData.province}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Typography variant='subtitle2' color='text.secondary'>
											Cena
										</Typography>
										<Typography variant='body1' sx={{ fontWeight: 700 }}>
											{formData.price &&
												`${Number(formData.price).toLocaleString()} zł`}
										</Typography>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				);
			default:
				return "Nieznany krok";
		}
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
					Ładowanie danych samochodu...
				</Typography>
			</Box>
		);
	}

	return (
		<>
			<PageHeader
				title={`Edytuj Samochód: ${formData.mark} ${formData.model}`}
				breadcrumbs={[
					{ label: "Pulpit", href: "/dashboard" },
					{ label: "Samochody", href: "/cars" },
					{ label: "Edytuj Samochód" }
				]}
			/>

			<DataCard title='Formularz edycji samochodu'>
				<Box sx={{ p: 3 }}>
					{submitError && (
						<Alert severity='error' sx={{ mb: 3 }}>
							{submitError}
						</Alert>
					)}

					{submitSuccess && (
						<Alert severity='success' sx={{ mb: 3 }}>
							Samochód został pomyślnie zaktualizowany! Przekierowywanie do
							listy samochodów...
						</Alert>
					)}

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
													startIcon={<SaveIcon />}
													disabled={submitSuccess}>
													Zapisz zmiany
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
							<Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
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
								<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
									{steps[activeStep].icon}
									<Typography variant='h6' sx={{ ml: 1 }}>
										{steps[activeStep].label}
									</Typography>
								</Box>
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ mb: 3 }}>
									{steps[activeStep].description}
								</Typography>
								<form onSubmit={handleSubmit}>
									{getStepContent(activeStep)}
								</form>
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
										activeStep === 0 ? () => navigate("/cars") : handleBack
									}
									startIcon={activeStep === 0 ? null : <ArrowBackIcon />}>
									{activeStep === 0 ? "Anuluj" : "Wstecz"}
								</Button>
								<Box>
									{activeStep === steps.length - 1 ? (
										<Button
											variant='contained'
											color='primary'
											onClick={handleSubmit}
											startIcon={<SaveIcon />}
											disabled={submitSuccess}>
											Zapisz zmiany
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
							</Box>
						</>
					)}
				</Box>
			</DataCard>
		</>
	);
};

export default EditCarForm;
