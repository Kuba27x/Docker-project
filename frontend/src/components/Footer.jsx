import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useTheme as useAppTheme } from "../context/ThemeContext";

import {
	Box,
	Container,
	Link,
	Typography,
	Grid,
	IconButton,
	Divider
} from "@mui/material";

const Footer = () => {
	const { mode } = useAppTheme();

	const product = ["Funkcje", "Cennik", "FAQ", "Demo"];

	const company = ["O nas", "Blog", "Kariera", "Kontakt"];

	const support = ["Pomoc", "Dokumentacja", "Status", "API"];

	const legal = ["Prywatność", "Warunki", "Cookies", "Licencje"];

	return (
		<Box
			sx={{
				bgcolor: mode === "light" ? "grey.900" : "grey.900",
				color: "white",
				py: 6
			}}>
			<Container maxWidth='lg'>
				<Grid container spacing={4}>
					<Grid item xs={12} md={4}>
						<Typography variant='h6' gutterBottom sx={{ fontWeight: 700 }}>
							AutoData
						</Typography>
						<Typography variant='body2' sx={{ opacity: 0.7, mb: 2 }}>
							Kompleksowe narzędzie do zarządzania danymi pojazdów, które pomaga
							użytkownikom efektywnie śledzić i analizować informacje o
							samochodach.
						</Typography>
						<Box sx={{ display: "flex", gap: 2 }}>
							<IconButton size='small' sx={{ color: "white" }}>
								<FacebookIcon />
							</IconButton>
							<IconButton size='small' sx={{ color: "white" }}>
								<XIcon />
							</IconButton>
							<IconButton size='small' sx={{ color: "white" }}>
								<LinkedInIcon />
							</IconButton>
							<IconButton size='small' sx={{ color: "white" }}>
								<InstagramIcon />
							</IconButton>
						</Box>
					</Grid>
					<Grid item xs={6} sm={3} md={2}>
						<Typography
							variant='subtitle1'
							gutterBottom
							sx={{ fontWeight: 700 }}>
							Produkt
						</Typography>
						<Box component='ul' sx={{ p: 0, m: 0, listStyle: "none" }}>
							{product.map((item, index) => (
								<LinkButton key={index} title={item} />
							))}
						</Box>
					</Grid>
					<Grid item xs={6} sm={3} md={2}>
						<Typography
							variant='subtitle1'
							gutterBottom
							sx={{ fontWeight: 700 }}>
							Firma
						</Typography>
						<Box component='ul' sx={{ p: 0, m: 0, listStyle: "none" }}>
							{company.map((item, index) => (
								<LinkButton key={index} title={item} />
							))}
						</Box>
					</Grid>
					<Grid item xs={6} sm={3} md={2}>
						<Typography
							variant='subtitle1'
							gutterBottom
							sx={{ fontWeight: 700 }}>
							Wsparcie
						</Typography>
						<Box component='ul' sx={{ p: 0, m: 0, listStyle: "none" }}>
							{support.map((item, index) => (
								<LinkButton key={index} title={item} />
							))}
						</Box>
					</Grid>
					<Grid item xs={6} sm={3} md={2}>
						<Typography
							variant='subtitle1'
							gutterBottom
							sx={{ fontWeight: 700 }}>
							Prawne
						</Typography>
						<Box component='ul' sx={{ p: 0, m: 0, listStyle: "none" }}>
							{legal.map((item, index) => (
								<LinkButton key={index} title={item} />
							))}
						</Box>
					</Grid>
				</Grid>
				<Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 2
					}}>
					<Typography variant='body2' sx={{ opacity: 0.7 }}>
						© {new Date().getFullYear()} AutoData. Wszelkie prawa zastrzeżone.
					</Typography>
					<Box sx={{ display: "flex", gap: 3 }}>
						<Link
							href='#'
							style={{
								color: "inherit",
								opacity: 0.7,
								textDecoration: "none",
								"&:hover": {
									opacity: 1,
									textDecoration: "underline",
									cursor: "pointer"
								}
							}}>
							<Typography variant='body2'>Prywatność</Typography>
						</Link>
						<Link
							href='#'
							style={{
								color: "inherit",
								opacity: 0.7,
								textDecoration: "none",
								"&:hover": {
									opacity: 1,
									textDecoration: "underline",
									cursor: "pointer"
								}
							}}>
							<Typography variant='body2'>Warunki</Typography>
						</Link>
						<Link
							href='#'
							style={{
								color: "inherit",
								opacity: 0.7,
								textDecoration: "none",
								"&:hover": {
									opacity: 1,
									textDecoration: "underline",
									cursor: "pointer"
								}
							}}>
							<Typography variant='body2'>Cookies</Typography>
						</Link>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;

const LinkButton = ({ title }) => {
	return (
		<Box component='li' sx={{ mb: 1 }}>
			<Link
				href='#'
				sx={{
					color: "inherit",
					opacity: 0.7,
					textDecoration: "none",
					"&:hover": {
						opacity: 1,
						textDecoration: "underline",
						cursor: "pointer"
					}
				}}>
				{title}
			</Link>
		</Box>
	);
};
