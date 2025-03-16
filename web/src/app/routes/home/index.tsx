import Container from "@/components/ui/container";
import "./index.scss";
import Sidebar from "@/features/sidebar/sidebar";
import Input from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import Button from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";

export default function HomePage() {
	return (
		<Container>
			<div id="layout">
				<div className="layout__side-column">
					<div className="layout__panel">
						<Sidebar />
					</div>
					<div className="layout__panel layout__panel--small">A</div>
				</div>
				<div className="layout__middle-column">
					<div className="layout__panel layout__panel--with-padding layout__panel--transparent">
						<div id="layout__convert">
							<div id="layout__convert__header">
								<Input startContent={<CiSearch />} />
								<Button color="primary" endContent={<FaPlus />}>Add Files</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="layout__side-column">
					<div className="layout__panel">A</div>
				</div>
			</div>
		</Container>
	)
}