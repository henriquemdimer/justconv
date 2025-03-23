import { CommonColors, CommonVariants } from "@/utils/common";

export class Toast {
	public readonly id = crypto.randomUUID();

	public constructor(
		public title: string,
		public description?: string,
		public color?: CommonColors,
		public variant?: CommonVariants) {}
}
