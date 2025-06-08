import { Paper, Box, Typography } from "@mui/material";

export default function StatCard({
	title,
	value,
	icon,
	color = "primary.main",
	min,
	max,
	sx
}) {
	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 3,
				...sx
			}}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
					mb: 2
				}}>
				<Typography variant='subtitle2' color='text.secondary'>
					{title}
				</Typography>
				{icon && (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							bgcolor: `${color}20`,
							color: color,
							borderRadius: 2,
							width: 40,
							height: 40
						}}>
						{icon}
					</Box>
				)}
			</Box>
			<Typography variant='h4' component='div' sx={{ fontWeight: 700, mb: 1 }}>
				{value}
			</Typography>
			{typeof min === "object" && min && (
				<Box sx={{ display: "flex", gap: 2, mt: 1 }}>
					<Typography variant='body2' color='text.secondary'>
						{min.text}: <b>{min.value}</b>
					</Typography>
				</Box>
			)}
			{typeof max === "object" && max && (
				<Box sx={{ display: "flex", gap: 2, mt: 1 }}>
					<Typography variant='body2' color='text.secondary'>
						{max.text}: <b>{max.value}</b>
					</Typography>
				</Box>
			)}
		</Paper>
	);
}
