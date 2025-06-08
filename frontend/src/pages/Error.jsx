import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const Error = () => {
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "background.default",
				px: 2
			}}>
			<ErrorOutlineIcon color='error' sx={{ fontSize: 80, mb: 2 }} />
			<Typography variant='h2' sx={{ fontWeight: 700, mb: 1 }}>
				404
			</Typography>
			<Typography variant='h5' sx={{ mb: 2 }}>
				Strona nie została znaleziona
			</Typography>
			<Typography
				variant='body1'
				color='text.secondary'
				sx={{ mb: 4, textAlign: "center" }}>
				Przepraszamy, ale podana strona nie istnieje lub została przeniesiona.
				<br />
				Sprawdź adres lub wróć na stronę główną.
			</Typography>
			<Button
				variant='contained'
				color='primary'
				size='large'
				onClick={() => navigate("/")}>
				Wróć na stronę główną
			</Button>
		</Box>
	);
};

export default Error;
