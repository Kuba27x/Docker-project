import { Paper, Box, Typography, Divider } from "@mui/material";

export default function DataCard({ title, subtitle, children, action, sx }) {
	return (
		<Paper
			elevation={0}
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 3,
				overflow: "hidden",
				...sx
			}}>
			<Box
				sx={{
					p: 3,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}>
				<Box>
					<Typography variant='h6' component='h2'>
						{title}
					</Typography>
					{subtitle && (
						<Typography variant='body2' color='text.secondary'>
							{subtitle}
						</Typography>
					)}
				</Box>
				{action && <Box>{action}</Box>}
			</Box>
			<Divider />
			<Box sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
				{children}
			</Box>
		</Paper>
	);
}
