export interface UIManagerOptions {
	fileInput: {
		id: string;
		multiple: boolean;
	}
}

export class UIManager {
	public readonly options: UIManagerOptions;

	public constructor(options?: Partial<UIManagerOptions>) {
		this.options = this.validateOptions(options);
	}

	private validateOptions(options?: Partial<UIManagerOptions>) {
		const validatedOptions = {
			fileInput: {
				id: "fileInput",
				multiple: true
			}
		}

		if(options) {
			if(options.fileInput) {
				if(options.fileInput.id) validatedOptions.fileInput.id = options.fileInput.id;
				if(options.fileInput.multiple) validatedOptions.fileInput.multiple = options.fileInput.multiple;
			}
		}

		return validatedOptions;
	}

	public init() {
		const input = document.createElement('input') as HTMLInputElement;
		input.type = "file";
		input.multiple = this.options.fileInput.multiple;
		input.id = this.options.fileInput.id;
		input.style.opacity = "0";
		input.style.pointerEvents = "none";
		input.style.position = "fixed";

		document.body.append(input);
	}

	public askForFiles(): Promise<FileList> {
		return new Promise((res, _) => {
			const input = document.getElementById(this.options.fileInput.id) as HTMLInputElement;
			if(input) {
				input.click();
				input.onchange = () => {
					res(input.files || new FileList());
				}
			}
		})
	}
}
