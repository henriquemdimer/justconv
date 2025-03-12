export interface Format {
	input: string;
	convertible: string[];
}

export interface FormatGroup {
	type: string;
	formats: Format[];
}
