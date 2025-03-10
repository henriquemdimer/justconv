import { State } from "../state/state";
import { Conversion, ConversionStatus } from "../types/conversion";

export interface IQueueState {
	files: Map<string, Conversion>;
}

export class QueueState extends State<IQueueState> {
	private files = new Map<string, Conversion>();

	public get data() {
		return {
			files: this.files
		}
	}

	public append(conversion: Conversion) {
		this.files.set(conversion.id, conversion);
		return this;
	}

	public syncId(old_id: string, new_id: string) {
		const file = this.files.get(old_id);
		if(file) {
			this.files.delete(file.id);
			this.files.set(new_id, file);
		}

		return this;
	}

	public updateStatus(id: string, status: ConversionStatus) {
		const file = this.files.get(id);

		if(file) {
			file.status = status;
			this.files.set(id, file);
		}

		return this;
	}
}
