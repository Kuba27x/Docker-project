import {
	Box,
	Typography,
	Breadcrumbs,
	Link as MuiLink,
	Paper
} from "@mui/material";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function PageHeader({ title, breadcrumbs, action }) {
	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				mb: 3,
				display: "flex",
				flexDirection: { xs: "column", sm: "row" },
				alignItems: { xs: "flex-start", sm: "center" },
				justifyContent: "space-between",
				gap: 2,
				backgroundColor: "background.default",
				borderRadius: 3
			}}>
			<Box>
				<Typography
					variant='h4'
					component='h1'
					gutterBottom={breadcrumbs ? true : false}>
					{title}
				</Typography>
				{breadcrumbs && (
					<Breadcrumbs
						separator={<NavigateNextIcon fontSize='small' />}
						aria-label='breadcrumb'>
						{breadcrumbs.map((item, index) => {
							const isLast = index === breadcrumbs.length - 1;
							return isLast || !item.href ? (
								<Typography key={item.label} color='text.secondary'>
									{item.label}
								</Typography>
							) : (
								<MuiLink
									key={item.label}
									component={Link}
									to={item.href}
									color='text.secondary'
									underline='hover'
									sx={{ textDecoration: "none" }}>
									{item.label}
								</MuiLink>
							);
						})}
					</Breadcrumbs>
				)}
			</Box>
			{action && <Box>{action}</Box>}
		</Paper>
	);
}
