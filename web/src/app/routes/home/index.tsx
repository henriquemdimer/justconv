import DefaultLayout from "@/app/layout/default";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Queue from "@/features/queue/queue";
import { app } from "@/lib";
import { useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleRight, FaPlus } from "react-icons/fa6";
import "./index.scss";

export default function HomePage() {
	const inputRef = useRef<HTMLInputElement>(null);

	function onFileUpload() {
		const files = inputRef.current?.files;
		if (inputRef.current && files) {
			app.uploadFiles(files);
			inputRef.current.value = "";
		}
	}

	return (
		<DefaultLayout>
			<input multiple onChange={() => onFileUpload()} ref={inputRef} type="file" id="fileUpload" />
			<div id="home__convert">
				<div id="home__convert__header">
					<Input placeholder="Search a file" startContent={<CiSearch />} />
					<div id="home__convert__header__actions">
						<Button onClick={() => inputRef.current?.click()} variant="outline" isIconOnly color="primary" startContent={<FaPlus />} />
						<Button onClick={() => app.convert()} color="primary" endContent={<FaAngleRight />}>Convert</Button>
					</div>
				</div>
				<Queue />
			</div>
		</DefaultLayout>
	)
}
