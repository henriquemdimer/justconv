import "./index.scss";
import Input from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import Button from "@/components/ui/button";
import { FaAngleRight, FaPlus } from "react-icons/fa6";
import Queue from "@/features/queue/queue";
import DefaultLayout from "@/app/layout/default";

export default function HomePage() {
	return (
		<DefaultLayout>
			<div id="home__convert">
				<div id="home__convert__header">
					<Input placeholder="Search a file" startContent={<CiSearch />} />
					<div id="home__convert__header__actions">
						<Button variant="outline" isIconOnly color="primary" startContent={<FaPlus />} />
						<Button color="primary" endContent={<FaAngleRight />}>Convert</Button>
					</div>
				</div>
				<Queue />
			</div>
		</DefaultLayout>
	)
}