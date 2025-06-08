import { Grid, Button, Box, Typography, CircularProgress } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TimelineIcon from "@mui/icons-material/Timeline";
import PageHeader from "../ui/PageHeader";
import StatCard from "../ui/StatCard";
import DataCard from "../ui/DataCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import axios from "axios";
import {
	carBrandConverter,
	fuelNameConverter,
	priceConverter
} from "../utils/converter";

const Dashboard = () => {
	const navigate = useNavigate();
	const { getToken } = useAuth();
	const [stats, setStats] = useState(null);
	const [recentCars, setRecentCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const calculateFuelPercentages = () => {
		if (!stats || !stats.cars_by_fuel || stats.cars_by_fuel.length === 0) {
			return [];
		}

		const totalCars = stats.total_cars || 0;
		const fuelColors = {
			Benzyna: "primary.main",
			Diesel: "secondary.main",
			Hybryda: "success.main",
			Elektryczny: "info.main",
			LPG: "warning.main",
			Gas: "warning.main",
			"Benzyna+LPG": "error.main"
		};

		return stats.cars_by_fuel.map((item) => ({
			fuel: item.fuel,
			count: item.count,
			percentage:
				totalCars > 0 ? Math.round((item.count / totalCars) * 100) : 0,
			color: fuelColors[fuelNameConverter(item.fuel)] || "grey.main"
		}));
	};

	const getCarColor = (index) => {
		const colors = [
			"primary.main",
			"secondary.main",
			"error.main",
			"info.main",
			"warning.main"
		];
		return colors[index % colors.length];
	};
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const headers = {
					Authorization: `Token ${getToken()}`
				};

				const [statsResponse, recentCarsResponse] = await Promise.all([
					axios.get("http://localhost:8000/api/statistics/", { headers }),
					axios.get("http://localhost:8000/api/recent-cars/", { headers })
				]);

				setStats(statsResponse.data);
				setRecentCars(recentCarsResponse.data);
			} catch (err) {
				console.error("Data fetch error:", err);
				setError("Błąd podczas pobierania danych. Spróbuj ponownie później.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [getToken]);

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

	if (error) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "50vh"
				}}>
				<Typography variant='h6' color='error' sx={{ ml: 2 }}>
					{error}
				</Typography>
			</Box>
		);
	}

	return (
		<>
			<PageHeader
				title='Panel sterowania'
				breadcrumbs={[{ label: "Pulpit" }]}
				action={
					<Button
						variant='contained'
						color='primary'
						startIcon={<AddCircleIcon />}
						onClick={() => navigate("/add-car")}>
						Dodaj Samochód
					</Button>
				}
			/>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Łączna liczba samochodów'
						value={
							stats.total_cars > 0
								? stats.total_cars.toLocaleString()
								: "Brak danych"
						}
						icon={<DirectionsCarIcon />}
						trend={{ value: 12, isPositive: true }}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Średnia cena'
						value={
							stats.avg_price > 0
								? priceConverter(stats.avg_price)
								: "Brak danych"
						}
						icon={<AttachMoneyIcon />}
						color='secondary.main'
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Średni przebieg'
						value={
							stats.avg_mileage > 0
								? `${stats.avg_mileage.toLocaleString()} km`
								: "Brak danych"
						}
						icon={<SpeedIcon />}
						color='warning.main'
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Średni rok produkcji'
						value={Math.round(stats.avg_year, 0) || "Brak danych"}
						icon={<TimelineIcon />}
						color='info.main'
					/>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<DataCard
						title='Ostatnio dodane samochody'
						subtitle='Ostatnie 5 dodanych pojazdów'
						action={
							<Button variant='text' onClick={() => navigate("/cars")}>
								Zobacz wszystkie
							</Button>
						}>
						<Box sx={{ p: 0 }}>
							{" "}
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									"& > div": {
										display: "flex",
										p: 2,
										borderBottom: "1px solid",
										borderColor: "divider",
										"&:last-child": {
											borderBottom: "none"
										}
									}
								}}>
								{recentCars && recentCars.length > 0 ? (
									recentCars.map((car, index) => (
										<Box key={car.id}>
											<Box
												sx={{ display: "flex", alignItems: "center", flex: 1 }}>
												<Box
													sx={{
														width: 40,
														height: 40,
														borderRadius: 2,
														bgcolor: getCarColor(index),
														color: "white",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														mr: 2
													}}>
													<DirectionsCarIcon />
												</Box>
												<Box>
													<Typography variant='subtitle1'>
														{carBrandConverter(car.mark)} {car.model}
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														{car.year} • {car.mileage?.toLocaleString()} km •{" "}
														{fuelNameConverter(car.fuel)}
													</Typography>
												</Box>
											</Box>
											<Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
												{priceConverter(car.price)}
											</Typography>
										</Box>
									))
								) : (
									<Box sx={{ textAlign: "center", py: 4 }}>
										<Typography variant='body2' color='text.secondary'>
											Brak ostatnio dodanych samochodów
										</Typography>
									</Box>
								)}
							</Box>
						</Box>
					</DataCard>
				</Grid>
				<Grid item xs={12} md={4}>
					<Grid container spacing={3} direction='column'>
						<Grid item xs={12}>
							{" "}
							<DataCard
								title='Rozkład typów paliwa'
								subtitle='Wszystkie samochody'>
								<Box
									sx={{
										p: 3,
										display: "flex",
										flexDirection: "column",
										gap: 2
									}}>
									{calculateFuelPercentages().length > 0 ? (
										calculateFuelPercentages().map((item, index) => (
											<Box key={index}>
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														mb: 1
													}}>
													<Box sx={{ display: "flex", alignItems: "center" }}>
														<Box
															sx={{
																width: 12,
																height: 12,
																borderRadius: "50%",
																bgcolor: item.color,
																mr: 1
															}}
														/>
														<Typography variant='body2'>
															{fuelNameConverter(item.fuel)}
														</Typography>
													</Box>
													<Typography variant='body2' fontWeight={600}>
														{item.percentage}%
													</Typography>
												</Box>
												<Box
													sx={{
														height: 8,
														bgcolor: "grey.200",
														borderRadius: 1,
														position: "relative",
														overflow: "hidden"
													}}>
													<Box
														sx={{
															position: "absolute",
															left: 0,
															top: 0,
															height: "100%",
															width: `${item.percentage}%`,
															bgcolor: item.color,
															borderRadius: 1
														}}
													/>
												</Box>
											</Box>
										))
									) : (
										<Box sx={{ textAlign: "center", py: 2 }}>
											<Typography variant='body2' color='text.secondary'>
												Brak danych o paliwach
											</Typography>
										</Box>
									)}
								</Box>
							</DataCard>
						</Grid>
						<Grid item xs={12}>
							<DataCard
								title='Szybkie akcje'
								action={
									<Button
										variant='text'
										onClick={() => navigate("/statistics")}>
										Więcej
									</Button>
								}>
								<Box
									sx={{
										p: 3,
										display: "flex",
										flexDirection: "column",
										gap: 2
									}}>
									<Button
										variant='outlined'
										color='primary'
										startIcon={<DirectionsCarIcon />}
										onClick={() => navigate("/cars")}
										fullWidth
										sx={{ justifyContent: "flex-start", py: 1.5 }}>
										Przeglądaj samochody
									</Button>
									<Button
										variant='outlined'
										color='secondary'
										startIcon={<BarChartIcon />}
										onClick={() => navigate("/statistics")}
										fullWidth
										sx={{ justifyContent: "flex-start", py: 1.5 }}>
										Zobacz statystyki
									</Button>
									<Button
										variant='outlined'
										color='info'
										startIcon={<CloudUploadIcon />}
										onClick={() => navigate("/upload")}
										fullWidth
										sx={{ justifyContent: "flex-start", py: 1.5 }}>
										Importuj dane CSV
									</Button>
									<Button
										variant='contained'
										color='primary'
										startIcon={<AddCircleIcon />}
										onClick={() => navigate("/add-car")}
										fullWidth
										sx={{ justifyContent: "flex-start", py: 1.5 }}>
										Dodaj nowy samochód
									</Button>
								</Box>
							</DataCard>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

export default Dashboard;
