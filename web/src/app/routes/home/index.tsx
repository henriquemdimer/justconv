import Container from "@/components/ui/container";
import "./index.scss";
import Sidebar from "@/features/sidebar/sidebar";
import Input from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import Button from "@/components/ui/button";
import { FaAngleRight, FaPlus, FaGithub } from "react-icons/fa6";
import Queue from "@/features/queue/queue";

export default function HomePage() {
	return (
		<Container>
			<div id="layout">
				<div className="layout__side-column">
					<div className="layout__panel">
						<Sidebar />
					</div>
					<div id="layout__self-host" className="layout__panel layout__panel--small layout__panel--with-padding">
						<h3>Self host</h3>
						<p>Did you know you can self-host this service on your own servers? It's easy—check out our GitHub repository!</p>
						<Button startContent={<FaGithub />} color="primary">Github</Button>
					</div>
				</div>
				<div className="layout__middle-column">
					<div className="layout__panel layout__panel--with-padding layout__panel--transparent">
						<div id="layout__convert">
							<div id="layout__convert__header">
								<Input placeholder="Search a file" startContent={<CiSearch />} />
								<div id="layout__convert__header__actions">
									<Button variant="outline" isIconOnly color="primary" startContent={<FaPlus />} />
									<Button color="primary" endContent={<FaAngleRight />}>Convert</Button>
								</div>
							</div>
							<Queue />
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