import DefaultLayout from "@/app/layout/default";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Queue from "@/features/queue/queue";
import { useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleRight, FaPlus } from "react-icons/fa6";
import "./index.scss";
import { useConversion } from "@/store/conversion";
import { Conversion, ConversionStatus } from "@/types/conversion";
import { convertBytesAuto } from "@/utils/convert";
import { useServers } from "@/store/servers";

export default function HomePage() {
	const inputRef = useRef<HTMLInputElement>(null);
	const conversionStore = useConversion();
	const server = useServers((state) => state.getActive());

	function onFileUpload() {
		const files = inputRef.current?.files;
		if (inputRef.current && files) {
			for (const file of files) {
				const split = file.type.split('/');
				const format = split[split.length - 1];
				conversionStore.set(new Conversion(
					file.name,
					new Blob([file]),
					{ initial: convertBytesAuto(file.size) },
					{ from: format }
				))
			}

			inputRef.current.value = "";
		}
	}

	function convert() {
		if (!server) return;

		for (const conv of conversionStore.list.values()) {
			if (!conv.format.to ||
				(conv.status !== ConversionStatus.WAITING &&
					conv.status !== ConversionStatus.FAILED)) continue;

			conversionStore.setStatus(conv.id, ConversionStatus.UPLOADING);
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), 5000);

			const form = new FormData();
			form.append("file", conv.blob, conv.name);

			(async () => {
				try {
					const res = await fetch(`${server.host}/convert?format=${conv.format.to}`, {
						method: "POST",
						body: form,
						signal: controller.signal
					});
					clearTimeout(timer);
						
					if(!res.ok) return conversionStore.setStatus(conv.id, ConversionStatus.FAILED);

					const body = await res.json();
					if(body && body.data) {
						conversionStore.syncId(conv.id, body.data.id);
						conversionStore.setStatus(body.data.id, ConversionStatus.PENDING);
						server.updater.subscribe(body.data.id);
					} else {
						conversionStore.setStatus(conv.id, ConversionStatus.FAILED);
					}
				} catch {
					conversionStore.setStatus(conv.id, ConversionStatus.FAILED);
				}
			})();
		}
	}

	return (
		<DefaultLayout>
			<input multiple onChange={() => onFileUpload()} ref={inputRef} type="file" id="fileUpload" />
			<div id="home__convert">
				<div id="home__convert__header">
					<Input placeholder="Search a file" startContent={<CiSearch />} />
					<div id="home__convert__header__actions">
						<Button
							onClick={() => inputRef.current?.click()}
							variant="outline"
							isIconOnly
							color="primary"
							startContent={<FaPlus />}
						/>
						<Button
							onClick={convert}
							color="primary"
							endContent={<FaAngleRight />}>
							Convert
						</Button>
					</div>
				</div>
				<Queue />
			</div>
		</DefaultLayout>
	)
}
