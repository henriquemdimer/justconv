export interface Format {
	name: string;
	convertible: string[];
}

export interface FormatsGroup {
	type: string;
	formats: Format[];
}
