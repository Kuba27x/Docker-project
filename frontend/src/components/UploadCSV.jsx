import axios from "axios";
import { useState } from "react";
import {
	Typography,
	Button,
	Box,
	Alert,
	AlertTitle,
	CircularProgress,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	LinearProgress
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DescriptionIcon from "@mui/icons-material/Description";
import PageHeader from "../ui/PageHeader";
import DataCard from "../ui/DataCard";
import { useAuth } from "../hooks/useAuth";

const UploadCSV = ({ auth }) => {
	const { getToken } = useAuth();
	const [selectedFile, setSelectedFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadStatus, setUploadStatus] = useState({
		success: false,
		error: false,
		message: ""
	});

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
		setUploadStatus({
			success: false,
			error: false,
			message: ""
		});
		setUploadProgress(0);
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setUploadStatus({
				success: false,
				error: true,
				message: "Proszę najpierw wybrać plik."
			});
			return;
		}

		if (!selectedFile.name.endsWith(".csv")) {
			setUploadStatus({
				success: false,
				error: true,
				message: "Proszę wybrać plik CSV."
			});
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);
		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			await axios.post("http://localhost:8000/api/upload-csv/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Token ${getToken()}`
				},
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setUploadProgress(percentCompleted);
				}
			});

			setUploadStatus({
				success: true,
				error: false,
				message: "Plik został pomyślnie przesłany i przetworzony!"
			});
			setSelectedFile(null);
			document.getElementById("csv-file-input").value = "";
		} catch (error) {
			let errorMessage = "Błąd dodawania pliku.";
			if (error.response && error.response.data) {
				errorMessage =
					error.response.data.error || JSON.stringify(error.response.data);
			}
			setUploadStatus({
				success: false,
				error: true,
				message: errorMessage
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<>
			<PageHeader
				title='Importuj Dane CSV'
				breadcrumbs={[
					{ label: "Pulpit", href: "/dashboard" },
					{ label: "Importuj Dane" }
				]}
			/>

			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: 3
				}}>
				<Box sx={{ flex: 1 }}>
					<DataCard
						title='Prześlij plik CSV'
						subtitle='Zaimportuj dane samochodów z pliku CSV'>
						<Box sx={{ p: 3 }}>
							{uploadStatus.success && (
								<Alert severity='success' sx={{ mb: 3 }}>
									<AlertTitle>Sukces</AlertTitle>
									{uploadStatus.message}
								</Alert>
							)}

							{uploadStatus.error && (
								<Alert severity='error' sx={{ mb: 3 }}>
									<AlertTitle>Błąd</AlertTitle>
									{uploadStatus.message}
								</Alert>
							)}

							<Box
								sx={{
									border: "2px dashed",
									borderColor: "divider",
									borderRadius: 2,
									p: 4,
									textAlign: "center",
									mb: 3,
									backgroundColor: "background.default"
								}}>
								<input
									accept='.csv'
									id='csv-file-input'
									type='file'
									onChange={handleFileChange}
									style={{ display: "none" }}
								/>
								<label htmlFor='csv-file-input'>
									<CloudUploadIcon
										sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
									/>
									<Typography variant='h6' gutterBottom>
										Przeciągnij i upuść plik CSV lub kliknij, aby wybrać
									</Typography>
									<Button
										variant='outlined'
										component='span'
										startIcon={<CloudUploadIcon />}>
										Wybierz plik CSV
									</Button>
								</label>
							</Box>

							{selectedFile && (
								<Box sx={{ mb: 3 }}>
									<Typography variant='subtitle1' gutterBottom>
										Wybrany plik:
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											p: 2,
											border: "1px solid",
											borderColor: "divider",
											borderRadius: 2
										}}>
										<DescriptionIcon sx={{ mr: 2, color: "primary.main" }} />
										<Box sx={{ flexGrow: 1 }}>
											<Typography variant='body1'>
												{selectedFile.name}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												{(selectedFile.size / 1024).toFixed(2)} KB
											</Typography>
										</Box>
									</Box>
								</Box>
							)}

							{isUploading && (
								<Box sx={{ mb: 3 }}>
									<Typography
										variant='body2'
										color='text.secondary'
										gutterBottom>
										Przesyłanie i przetwarzanie pliku...
									</Typography>
									<LinearProgress
										variant='determinate'
										value={uploadProgress}
										sx={{ mb: 1 }}
									/>
									<Typography
										variant='body2'
										color='text.secondary'
										align='right'>
										{uploadProgress}%
									</Typography>
								</Box>
							)}

							<Button
								variant='contained'
								color='primary'
								onClick={handleUpload}
								disabled={!selectedFile || isUploading}
								startIcon={
									isUploading ? (
										<CircularProgress size={24} color='inherit' />
									) : (
										<CloudUploadIcon />
									)
								}
								fullWidth
								size='large'
								sx={{ mt: 2 }}>
								{isUploading ? "Przesyłanie..." : "Prześlij i przetwórz dane"}
							</Button>
						</Box>
					</DataCard>
				</Box>

				<Box sx={{ flex: 1 }}>
					<DataCard
						title='Wytyczne dotyczące formatu CSV'
						subtitle='Jak przygotować plik do importu'>
						<Box sx={{ p: 3 }}>
							<Alert severity='info' sx={{ mb: 3 }}>
								<AlertTitle>Ważne informacje</AlertTitle>
								Upewnij się, że Twój plik CSV zawiera wszystkie wymagane kolumny
								w odpowiednim formacie.
							</Alert>

							<Typography variant='subtitle1' gutterBottom>
								Wymagane kolumny:
							</Typography>
							<Box
								sx={{
									p: 2,
									backgroundColor: "background.default",
									borderRadius: 2,
									fontFamily: "monospace",
									mb: 3,
									overflowX: "auto"
								}}>
								<Typography variant='body2'>
									mark, model, generation_name, year, mileage, vol_engine, fuel,
									city, province, price
								</Typography>
							</Box>

							<Divider sx={{ my: 3 }} />

							<Typography variant='subtitle1' gutterBottom>
								Zasady formatowania:
							</Typography>
							<List dense>
								<ListItem>
									<ListItemIcon>
										<CheckCircleIcon color='success' />
									</ListItemIcon>
									<ListItemText primary='Pierwszy wiersz powinien zawierać nagłówki kolumn' />
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<CheckCircleIcon color='success' />
									</ListItemIcon>
									<ListItemText primary='Wszystkie pola numeryczne (rok, przebieg, pojemnosc_silnika, cena) powinny zawierać tylko liczby' />
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<CheckCircleIcon color='success' />
									</ListItemIcon>
									<ListItemText primary='Kodowanie pliku powinno być UTF-8' />
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<ErrorIcon color='error' />
									</ListItemIcon>
									<ListItemText primary='Nie używaj cudzysłowów wokół wartości, chyba że zawierają przecinki' />
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<ErrorIcon color='error' />
									</ListItemIcon>
									<ListItemText primary='Nie używaj polskich znaków w nazwach kolumn' />
								</ListItem>
							</List>

							<Divider sx={{ my: 3 }} />

							<Typography variant='subtitle1' gutterBottom>
								Przykładowy wiersz:
							</Typography>
							<Box
								sx={{
									p: 2,
									backgroundColor: "background.default",
									borderRadius: 2,
									fontFamily: "monospace",
									mb: 3,
									overflowX: "auto"
								}}>
								<Typography variant='body2'>
									Toyota,Corolla,E210,2019,45000,1.8,Benzyna,Warszawa,Mazowieckie,85000
								</Typography>
							</Box>

							<Alert severity='warning'>
								<AlertTitle>Uwaga</AlertTitle>
								Upewnij się, że wszystkie dane są poprawne przed importem.
								Nieprawidłowe dane mogą spowodować błędy w systemie.
							</Alert>
						</Box>
					</DataCard>
				</Box>
			</Box>
		</>
	);
};

export default UploadCSV;
