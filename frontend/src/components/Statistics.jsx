import axios from "axios";
import { useState, useEffect } from "react";
import {
	Grid,
	Box,
	Typography,
	MenuItem,
	TextField,
	CircularProgress,
	Button
} from "@mui/material";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import { useAuth } from "../hooks/useAuth";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement
} from "chart.js";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "../ui/PageHeader";
import DataCard from "../ui/DataCard";
import StatCard from "../ui/StatCard";
import { carBrandConverter, fuelNameConverter } from "../utils/converter";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement
);

const Statistics = () => {
	const { getToken } = useAuth();
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [timeRange, setTimeRange] = useState("all");

	const refreshData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(
				"http://localhost:8000/api/statistics/",
				{
					headers: {
						Authorization: `Token ${getToken()}`
					}
				}
			);
			setStats(response.data);
		} catch (err) {
			console.error("Statistics fetch error:", err);
			setError("Błąd podczas pobierania statystyk. Spróbuj ponownie później.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchStatistics = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await axios.get(
					"http://localhost:8000/api/statistics/",
					{
						headers: {
							Authorization: `Token ${getToken()}`
						}
					}
				);
				setStats(response.data);
			} catch (err) {
				console.error("Statistics fetch error:", err);
				setError(
					"Błąd podczas pobierania statystyk. Spróbuj ponownie później."
				);
			} finally {
				setLoading(false);
			}
		};

		fetchStatistics();
	}, [getToken]);

	const handleTimeRangeChange = (event) => {
		setTimeRange(event.target.value);
	};

	const handleRefresh = () => {
		refreshData();
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

	if (
		!stats ||
		!stats.price_trends ||
		!stats.cars_by_fuel ||
		!stats.cars_by_mark ||
		!stats.cars_by_province
	) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "50vh"
				}}>
				<Typography variant='h6' sx={{ ml: 2 }}>
					Brak danych do wyświetlenia.
				</Typography>
			</Box>
		);
	}

	const fuelData = {
		labels: stats.cars_by_fuel.map((item) => fuelNameConverter(item.fuel)),
		datasets: [
			{
				label: "Samochody wg rodzaju paliwa",
				data: stats.cars_by_fuel.map((item) => item.count),
				backgroundColor: [
					"rgba(59, 130, 246, 0.7)",
					"rgba(16, 185, 129, 0.7)",
					"rgba(245, 158, 11, 0.7)",
					"rgba(239, 68, 68, 0.7)",
					"rgba(139, 92, 246, 0.7)"
				],
				borderWidth: 0
			}
		]
	};

	const brandData = {
		labels: stats.cars_by_mark.map((item) => carBrandConverter(item.mark)),
		datasets: [
			{
				label: "Liczba samochodów",
				data: stats.cars_by_mark.map((item) => item.count),
				backgroundColor: "rgba(59, 130, 246, 0.7)",
				borderWidth: 0
			}
		]
	};

	const provinceData = {
		labels: stats.cars_by_province.map((item) => item.province),
		datasets: [
			{
				label: "Samochody wg województwa",
				data: stats.cars_by_province.map((item) => item.count),
				backgroundColor: [
					"rgba(59, 130, 246, 0.7)",
					"rgba(16, 185, 129, 0.7)",
					"rgba(245, 158, 11, 0.7)",
					"rgba(239, 68, 68, 0.7)",
					"rgba(139, 92, 246, 0.7)",
					"rgba(236, 72, 153, 0.7)",
					"rgba(6, 182, 212, 0.7)",
					"rgba(132, 204, 22, 0.7)",
					"rgba(249, 115, 22, 0.7)",
					"rgba(168, 85, 247, 0.7)",
					"rgba(234, 179, 8, 0.7)",
					"rgba(8, 145, 178, 0.7)",
					"rgba(217, 70, 239, 0.7)",
					"rgba(20, 184, 166, 0.7)",
					"rgba(244, 63, 94, 0.7)",
					"rgba(251, 146, 60, 0.7)"
				],
				borderWidth: 0
			}
		]
	};

	const priceData = {
		labels: stats.price_trends.map((item) => item.month),
		datasets: [
			{
				label: "Średnia cena",
				data: stats.price_trends.map((item) => item.avg_price),
				borderColor: "rgba(59, 130, 246, 1)",
				backgroundColor: "rgba(59, 130, 246, 0.1)",
				borderWidth: 2,
				fill: true,
				tension: 0.4
			}
		]
	};

	return (
		<>
			<PageHeader
				title='Statystyki'
				breadcrumbs={[
					{ label: "Pulpit", href: "/dashboard" },
					{ label: "Statystyki" }
				]}
				action={
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							select
							label='Zakres czasu'
							value={timeRange}
							onChange={handleTimeRangeChange}
							variant='outlined'
							size='small'
							sx={{ minWidth: 150 }}>
							<MenuItem value='all'>Wszystkie dane</MenuItem>
							<MenuItem value='month'>Ostatni miesiąc</MenuItem>
							<MenuItem value='quarter'>Ostatni kwartał</MenuItem>
							<MenuItem value='year'>Ostatni rok</MenuItem>
						</TextField>
						<Button
							variant='outlined'
							startIcon={<RefreshIcon />}
							onClick={handleRefresh}>
							Odśwież
						</Button>
					</Box>
				}
			/>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Łączna liczba samochodów'
						value={stats.total_cars.toLocaleString()}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Średnia cena'
						value={`${stats.avg_price.toLocaleString()} zł`}
						color='secondary.main'
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Średni przebieg'
						value={`${stats.avg_mileage.toLocaleString()} km`}
						color='warning.main'
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Średni rok produkcji'
						value={stats.avg_year.toString()}
						color='info.main'
					/>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<DataCard title='Trendy cenowe' subtitle='Średnia cena w czasie'>
						<Box sx={{ p: 3, height: 300 }}>
							<Line
								data={priceData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											display: false
										},
										tooltip: {
											callbacks: {
												label: (context) =>
													`${
														context.dataset.label
													}: ${context.parsed.y.toLocaleString()} zł`
											}
										}
									},
									scales: {
										y: {
											beginAtZero: false,
											ticks: {
												callback: (value) => value.toLocaleString() + " zł"
											}
										}
									}
								}}
							/>
						</Box>
					</DataCard>
				</Grid>
				<Grid item xs={12} md={4}>
					<DataCard title='Rozkład typów paliwa' subtitle='Wszystkie samochody'>
						<Box sx={{ p: 3, height: 300 }}>
							<Doughnut
								data={fuelData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: "right"
										}
									}
								}}
							/>
						</Box>
					</DataCard>
				</Grid>
				<Grid item xs={12} md={6}>
					<DataCard title='Samochody według marki' subtitle='Top 10 marek'>
						<Box sx={{ p: 3, height: 400 }}>
							<Bar
								data={brandData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											display: false
										}
									},
									scales: {
										y: {
											beginAtZero: true
										}
									}
								}}
							/>
						</Box>
					</DataCard>
				</Grid>
				<Grid item xs={12} md={6}>
					<DataCard
						title='Samochody według województwa'
						subtitle='Rozkład geograficzny'>
						<Box sx={{ p: 3, height: 400 }}>
							<Pie
								data={provinceData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: "right",
											labels: {
												boxWidth: 15,
												font: {
													size: 11
												}
											}
										}
									}
								}}
							/>
						</Box>
					</DataCard>
				</Grid>
			</Grid>
		</>
	);
};

export default Statistics;
