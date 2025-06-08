import { fuelTypes } from "../data/data";

export const fuelNameConverter = (fuelType) => {
	switch (fuelType.toLowerCase()) {
		case "gasoline":
			return fuelTypes[0];
		case "diesel":
			return fuelTypes[1];
		case "electric":
			return fuelTypes[2];
		case "hybrid":
			return fuelTypes[3];
		case "lpg":
			return fuelTypes[4];
		case "cng":
			return fuelTypes[5];
		default:
			return fuelTypes[7];
	}
};

export const priceConverter = (price) => {
	if (typeof price === "string") {
		const num = Number(price.replace(/\s/g, "").replace(",", "."));
		if (isNaN(num)) return "";
		price = num;
	}
	if (typeof price !== "number" || isNaN(price)) return "";
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " zł";
};

export const carVolEngineConverter = (engineVolume) => {
	let volume = engineVolume;

	if (typeof engineVolume === "string") {
		const cleanedString = engineVolume.replace(/\s/g, "").replace(",", ".");
		volume = Number(cleanedString);
		if (isNaN(volume)) return "";
	}

	if (typeof volume !== "number" || isNaN(volume)) return "";

	if (volume > 0.1 && volume < 100 && volume % 1 !== 0) {
		volume = Math.round(volume * 1000);
	}

	return volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " cm³";
};

export const carBrandConverter = (brand) => {
	if (typeof brand !== "string") return "";
	brand = brand.trim();
	if (brand.length === 0) return "";
	return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
};
