import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Button,
	Box,
	Link as MuiLink,
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Grid,
	Chip,
	IconButton,
	InputAdornment,
	Collapse,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
	Card,
	CardContent,
	CardActions,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import GetAppIcon from "@mui/icons-material/GetApp";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "../ui/PageHeader";
import DataCard from "../ui/DataCard";
import {
	carBrandConverter,
	carVolEngineConverter,
	fuelNameConverter,
	priceConverter
} from "../utils/converter";
import { provinces } from "../data/data";

const CarList = () => {
	const navigate = useNavigate();
	const { getToken } = useAuth();
	const [cars, setCars] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [totalCount, setTotalCount] = useState(0);
	const [error, setError] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [carToDelete, setCarToDelete] = useState(null);
	const [filters, setFilters] = useState({
		mark: "",
		model: "",
		year_min: "",
		year_max: "",
		fuel: "",
		province: "",
		price_min: "",
		price_max: ""
	});
	const [tempFilters, setTempFilters] = useState({
		mark: "",
		model: "",
		year_min: "",
		year_max: "",
		fuel: "",
		province: "",
		price_min: "",
		price_max: ""
	});
	const [distinctMarks, setDistinctMarks] = useState([]);
	const [distinctFuels, setDistinctFuels] = useState([]);
	const [sortOption, setSortOption] = useState("");
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

	useEffect(() => {
		const fetchDistinctValues = async () => {
			try {
				const apiUrl =
					process.env.REACT_APP_API_URL || "http://localhost:8000/api";
				const response = await axios.get(`${apiUrl}/distinct/`, {
					headers: { Authorization: `Token ${getToken()}` }
				});
				if (response.data) {
					setDistinctMarks(response.data.marks?.sort() || []);
					setDistinctFuels(response.data.fuels?.sort() || []);
				}
			} catch (err) {
				console.error("Error fetching distinct values:", err);
			}
		};
		fetchDistinctValues();
	}, [getToken]);

	useEffect(() => {
		const fetchCars = async () => {
			setError("");
			try {
				const queryParams = new URLSearchParams();
				Object.entries(filters).forEach(([key, value]) => {
					if (value !== "" && value !== null && value !== undefined) {
						queryParams.append(key, value);
					}
				});
				if (searchTerm.trim()) {
					queryParams.append("search", searchTerm.trim());
				}
				// Dodaj parametry sortowania
				if (sortOption) {
					if (sortOption === "price_asc")
						queryParams.append("ordering", "price");
					else if (sortOption === "price_desc")
						queryParams.append("ordering", "-price");
					else if (sortOption === "mileage_asc")
						queryParams.append("ordering", "mileage");
					else if (sortOption === "mileage_desc")
						queryParams.append("ordering", "-mileage");
				}
				queryParams.append("page", page + 1);
				queryParams.append("page_size", rowsPerPage);
				const apiUrl =
					process.env.REACT_APP_API_URL || "http://localhost:8000/api";
				const response = await axios.get(
					`${apiUrl}/cars/?${queryParams.toString()}`,
					{ headers: { Authorization: `Token ${getToken()}` } }
				);
				setCars(response.data.results || response.data);
				setTotalCount(response.data.count || response.data.length);
			} catch (err) {
				console.error("Error fetching cars:", err);
				setError("Nie udało się pobrać danych o samochodach");
			}
		};
		fetchCars();
	}, [filters, searchTerm, getToken, page, rowsPerPage, sortOption]);

	useEffect(() => {
		setTempFilters(filters);
	}, [filters]);

	const handleChangePage = (_, newPage) => {
		if (totalCount > 0) setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		if (totalCount > 0) {
			setRowsPerPage(Number.parseInt(event.target.value, 10));
			setPage(0);
		}
	};
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setTempFilters((prev) => ({ ...prev, [name]: value }));
	};
	const applyFilters = () => {
		setFilters(tempFilters);
		setSearchTerm(searchInput);
		setPage(0);
	};
	const resetFilters = () => {
		const emptyFilters = {
			mark: "",
			model: "",
			year_min: "",
			year_max: "",
			fuel: "",
			province: "",
			price_min: "",
			price_max: ""
		};
		setFilters(emptyFilters);
		setTempFilters(emptyFilters);
		setSearchInput("");
		setSearchTerm("");
		setPage(0);
	};
	const handleSearchChange = (e) => {
		setSearchInput(e.target.value);
	};
	const clearSearch = () => {
		setSearchInput("");
		setSearchTerm("");
		setPage(0);
	};
	const handleEdit = (carId) => {
		navigate(`/edit-car/${carId}`);
	};
	const handleDeleteConfirmation = (car) => {
		setCarToDelete(car);
		setDeleteDialogOpen(true);
	};
	const handleDelete = async () => {
		if (carToDelete) {
			try {
				const apiUrl =
					process.env.REACT_APP_API_URL || "http://localhost:8000/api";
				await axios.delete(`${apiUrl}/cars/${carToDelete.id}/`, {
					headers: { Authorization: `Token ${getToken()}` }
				});
				setCars((prev) => prev.filter((car) => car.id !== carToDelete.id));
				handleCloseDeleteDialog();
			} catch (err) {
				setError("Nie udało się usunąć samochodu");
			} finally {
				handleCloseDeleteDialog();
			}
		}
	};
	const handleCloseDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setCarToDelete(null);
	};
	const handleExport = async (format) => {
		try {
			const queryParams = new URLSearchParams();
			Object.entries(filters)
				.filter(([_, value]) => value !== "")
				.forEach(([key, value]) => {
					queryParams.append(key, value);
				});
			if (searchTerm.trim()) {
				queryParams.append("search", searchTerm.trim());
			}
			const endpoint = format === "csv" ? "export-csv" : "export-json";
			const response = await axios.get(
				`http://localhost:8000/api/${endpoint}/?${queryParams.toString()}`,
				{
					headers: { Authorization: `Token ${getToken()}` },
					responseType: "blob"
				}
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`car_data_${new Date().toISOString().slice(0, 10)}.${format}`
			);
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (err) {
			setError(`Nie udało się pobrać w formacie ${format}`);
		}
	};

	const memoizedMarks = useMemo(
		() => Array.from(new Set((distinctMarks || []).filter(Boolean))),
		[distinctMarks]
	);
	const memoizedFuels = useMemo(
		() => Array.from(new Set((distinctFuels || []).filter(Boolean))),
		[distinctFuels]
	);

	const renderCarCard = (car) => (
		<Card key={car.id} sx={{ mb: 2, borderRadius: 2 }}>
			<CardContent>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						mb: 1
					}}>
					<Box>
						<Typography variant='h6' component='div'>
							{carBrandConverter(car.mark)} {car.model}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{car.generation_name || "-"}
						</Typography>
					</Box>
					<Typography
						variant='h6'
						color='primary.main'
						sx={{ fontWeight: 600 }}>
						{priceConverter(car.price)}
					</Typography>
				</Box>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
					<Chip label={`${car.year}`} size='small' variant='outlined' />
					<Chip
						label={`${car.mileage.toLocaleString()} km`}
						size='small'
						variant='outlined'
					/>
					<Chip
						label={carVolEngineConverter(car.vol_engine)}
						size='small'
						variant='outlined'
					/>
					<Chip
						label={fuelNameConverter(car.fuel)}
						size='small'
						color={
							car.fuel === "Gasoline" || car.fuel === "gasoline"
								? "primary"
								: car.fuel === "Diesel" || car.fuel === "diesel"
								? "secondary"
								: car.fuel === "Hybrid" || car.fuel === "hybrid"
								? "success"
								: car.fuel === "Electric" || car.fuel === "electric"
								? "info"
								: "default"
						}
						variant='outlined'
					/>
				</Box>
				<Typography variant='body2' color='text.secondary'>
					Lokalizacja: {car.city}, {car.province}
				</Typography>
			</CardContent>
			<CardActions
				sx={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 1 }}>
				<Button
					size='small'
					color='info'
					startIcon={<EditIcon />}
					onClick={() => handleEdit(car.id)}>
					Edytuj
				</Button>
				<Button
					size='small'
					color='error'
					startIcon={<DeleteIcon />}
					onClick={() => handleDeleteConfirmation(car)}>
					Usuń
				</Button>
			</CardActions>
		</Card>
	);

	if (error) {
		return <Typography color='error'>{error}</Typography>;
	}

	return (
		<>
			<PageHeader
				title='Lista Samochodów'
				breadcrumbs={[
					{ label: "Pulpit", href: "/dashboard" },
					{ label: "Samochody" }
				]}
				action={
					<Button
						variant='contained'
						color='primary'
						startIcon={<AddIcon />}
						component={MuiLink}
						href='/add-car'>
						Dodaj Samochód
					</Button>
				}
			/>
			<DataCard
				title='Wyszukiwanie i filtry'
				subtitle='Znajdź interesujące Cię samochody'
				sx={{ mb: 3 }}>
				<Box sx={{ p: 3 }}>
					<Grid container spacing={2} alignItems='center'>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: "flex", gap: 1 }}>
								<TextField
									fullWidth
									placeholder='Szukaj po marce, modelu, mieście...'
									value={searchInput}
									onChange={handleSearchChange}
									autoFocus
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<SearchIcon />
											</InputAdornment>
										),
										endAdornment: searchInput && (
											<InputAdornment position='end'>
												<IconButton size='small' onClick={clearSearch}>
													<ClearIcon />
												</IconButton>
											</InputAdornment>
										)
									}}
								/>
								<Button
									variant='contained'
									color='primary'
									onClick={applyFilters}
									sx={{ minWidth: "100px" }}>
									Szukaj
								</Button>
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box
								sx={{
									display: "flex",
									gap: 1,
									justifyContent: { xs: "flex-start", md: "flex-end" },
									flexWrap: "wrap"
								}}>
								<FormControl sx={{ minWidth: 180 }} size='small'>
									<InputLabel id='sort-label'>Sortuj</InputLabel>
									<Select
										labelId='sort-label'
										id='sort'
										value={sortOption}
										label='Sortuj'
										onChange={(e) => setSortOption(e.target.value)}>
										<MenuItem value=''>Domyślnie</MenuItem>
										<MenuItem value='price_asc'>Cena rosnąco</MenuItem>
										<MenuItem value='price_desc'>Cena malejąco</MenuItem>
										<MenuItem value='mileage_asc'>Przebieg rosnąco</MenuItem>
										<MenuItem value='mileage_desc'>Przebieg malejąco</MenuItem>
									</Select>
								</FormControl>
								<Button
									variant='outlined'
									startIcon={<FilterListIcon />}
									onClick={() => setShowFilters(!showFilters)}>
									{showFilters ? "Ukryj filtry" : "Pokaż filtry"}
								</Button>
								<Button
									variant='outlined'
									color='secondary'
									disabled={cars.length === 0}
									startIcon={<GetAppIcon />}
									onClick={() => handleExport("csv")}>
									{isSmall ? "CSV" : "Eksport CSV"}
								</Button>
								<Button
									variant='outlined'
									color='secondary'
									disabled={cars.length === 0}
									startIcon={<GetAppIcon />}
									onClick={() => handleExport("json")}>
									{isSmall ? "JSON" : "Eksport JSON"}
								</Button>
							</Box>
						</Grid>
					</Grid>
					<Collapse in={showFilters}>
						<Box sx={{ mt: 3 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6} md={3}>
									<FormControl fullWidth>
										<InputLabel id='mark-label'>Marka</InputLabel>
										<Select
											labelId='mark-label'
											id='mark'
											name='mark'
											value={tempFilters.mark}
											label='Marka'
											onChange={handleFilterChange}>
											<MenuItem value=''>Wszystkie</MenuItem>
											{memoizedMarks.map((mark) => (
												<MenuItem key={mark} value={mark}>
													{carBrandConverter(mark)}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										fullWidth
										id='model'
										name='model'
										label='Model'
										value={tempFilters.model}
										onChange={handleFilterChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										fullWidth
										id='year_min'
										name='year_min'
										label='Rok (od)'
										type='number'
										value={tempFilters.year_min}
										onChange={handleFilterChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										fullWidth
										id='year_max'
										name='year_max'
										label='Rok (do)'
										type='number'
										value={tempFilters.year_max}
										onChange={handleFilterChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControl fullWidth>
										<InputLabel id='fuel-label'>Paliwo</InputLabel>
										<Select
											labelId='fuel-label'
											id='fuel'
											name='fuel'
											value={tempFilters.fuel}
											label='Paliwo'
											onChange={handleFilterChange}>
											<MenuItem value=''>Wszystkie</MenuItem>
											{memoizedFuels.map((fuel) => (
												<MenuItem key={fuel} value={fuel}>
													{fuelNameConverter(fuel)}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<FormControl fullWidth>
										<InputLabel id='province-label'>Województwo</InputLabel>
										<Select
											labelId='province-label'
											id='province'
											name='province'
											value={tempFilters.province}
											label='Województwo'
											onChange={handleFilterChange}>
											<MenuItem value=''>Wszystkie</MenuItem>
											{provinces.map((province) => (
												<MenuItem key={province} value={province}>
													{province}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										fullWidth
										id='price_min'
										name='price_min'
										label='Cena (od)'
										type='number'
										value={tempFilters.price_min}
										onChange={handleFilterChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										fullWidth
										id='price_max'
										name='price_max'
										label='Cena (do)'
										type='number'
										value={tempFilters.price_max}
										onChange={handleFilterChange}
									/>
								</Grid>
							</Grid>
							<Box
								sx={{
									mt: 2,
									display: "flex",
									justifyContent: "flex-end",
									flexWrap: "wrap",
									gap: 1
								}}>
								<Button
									variant='outlined'
									onClick={resetFilters}
									color='secondary'>
									Resetuj filtry
								</Button>
								<Button
									variant='contained'
									color='primary'
									onClick={applyFilters}>
									Zastosuj filtry
								</Button>
							</Box>
						</Box>
					</Collapse>
				</Box>
			</DataCard>
			<DataCard title={`Znalezione samochody (${totalCount || 0})`}>
				{isMobile ? (
					<Box sx={{ p: 2 }}>
						{cars.map((car) => renderCarCard(car))}
						{cars.length === 0 && (
							<Box sx={{ py: 3, textAlign: "center" }}>
								<Typography variant='subtitle1'>
									Nie znaleziono samochodów
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									Spróbuj zmienić kryteria wyszukiwania
								</Typography>
							</Box>
						)}
						{totalCount > 0 && (
							<TablePagination
								rowsPerPageOptions={[25, 50, 100]}
								component='div'
								count={totalCount}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								labelRowsPerPage='Na stronę:'
								labelDisplayedRows={({ from, to, count }) =>
									`${from}-${to} z ${count !== -1 ? count : `więcej niż ${to}`}`
								}
							/>
						)}
					</Box>
				) : (
					<>
						<TableContainer>
							<Table sx={{ minWidth: 650 }}>
								<TableHead>
									<TableRow>
										<TableCell>Marka i model</TableCell>
										<TableCell>Rok</TableCell>
										<TableCell>Przebieg</TableCell>
										<TableCell>Silnik</TableCell>
										<TableCell>Paliwo</TableCell>
										<TableCell>Lokalizacja</TableCell>
										<TableCell align='right'>Cena</TableCell>
										<TableCell align='center'>Akcje</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cars.map((car) => (
										<TableRow key={car.id} hover>
											<TableCell>
												<Box sx={{ display: "flex", flexDirection: "column" }}>
													<Typography
														variant='subtitle2'
														sx={{ fontWeight: 600 }}>
														{carBrandConverter(car.mark)} {car.model}
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														{car.generation_name || "-"}
													</Typography>
												</Box>
											</TableCell>
											<TableCell>{car.year}</TableCell>
											<TableCell>{car.mileage.toLocaleString()} km</TableCell>
											<TableCell>
												{carVolEngineConverter(car.vol_engine)}
											</TableCell>
											<TableCell>
												<Chip
													label={fuelNameConverter(car.fuel)}
													size='small'
													color={
														car.fuel === "Gasoline" || car.fuel === "gasoline"
															? "primary"
															: car.fuel === "Diesel" || car.fuel === "diesel"
															? "secondary"
															: car.fuel === "Hybrid" || car.fuel === "hybrid"
															? "success"
															: car.fuel === "Electric" ||
															  car.fuel === "electric"
															? "info"
															: "default"
													}
													variant='outlined'
												/>
											</TableCell>
											<TableCell>
												<Box sx={{ display: "flex", flexDirection: "column" }}>
													<Typography variant='body2'>{car.city}</Typography>
													<Typography variant='body2' color='text.secondary'>
														{car.province}
													</Typography>
												</Box>
											</TableCell>
											<TableCell align='right'>
												<Typography
													variant='subtitle2'
													sx={{ fontWeight: 600 }}>
													{priceConverter(car.price)}
												</Typography>
											</TableCell>
											<TableCell align='center'>
												<Box
													sx={{
														display: "flex",
														justifyContent: "center",
														gap: 1
													}}>
													<Tooltip title='Edytuj'>
														<IconButton
															size='small'
															color='info'
															onClick={() => handleEdit(car.id)}>
															<EditIcon fontSize='small' />
														</IconButton>
													</Tooltip>
													<Tooltip title='Usuń'>
														<IconButton
															size='small'
															color='error'
															onClick={() => handleDeleteConfirmation(car)}>
															<DeleteIcon fontSize='small' />
														</IconButton>
													</Tooltip>
												</Box>
											</TableCell>
										</TableRow>
									))}
									{cars.length === 0 && (
										<TableRow>
											<TableCell colSpan={8} align='center'>
												<Box sx={{ py: 3 }}>
													<Typography variant='subtitle1'>
														Nie znaleziono samochodów
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														Spróbuj zmienić kryteria wyszukiwania
													</Typography>
												</Box>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
						{totalCount > 0 && (
							<TablePagination
								rowsPerPageOptions={[25, 50, 100, 250]}
								component='div'
								count={totalCount}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								labelRowsPerPage='Wierszy na stronę:'
								labelDisplayedRows={({ from, to, count }) =>
									`${from}-${to} z ${count !== -1 ? count : `więcej niż ${to}`}`
								}
							/>
						)}
					</>
				)}
			</DataCard>
			<Dialog
				open={deleteDialogOpen}
				onClose={handleCloseDeleteDialog}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'>
				<DialogTitle id='alert-dialog-title'>
					Potwierdzenie usunięcia
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						{carToDelete && (
							<>
								Czy na pewno chcesz usunąć samochód{" "}
								{carBrandConverter(carToDelete.mark)} {carToDelete.model} (
								{carToDelete.year})?
								<br />
								Ta operacja jest nieodwracalna.
							</>
						)}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteDialog} color='primary'>
						Anuluj
					</Button>
					<Button
						onClick={handleDelete}
						color='error'
						variant='contained'
						autoFocus>
						Usuń
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default CarList;
