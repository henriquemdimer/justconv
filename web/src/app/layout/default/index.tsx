import "./index.scss";

import Button from "@/components/ui/button";
import Container from "@/components/ui/container";
import Sidebar from "@/features/sidebar/sidebar";
import { ReactNode } from "react"
import { FaGithub } from "react-icons/fa6";

export interface DefaultLayoutProps {
    children: ReactNode;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
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
                        {props.children}
                    </div>
                </div>
                <div className="layout__side-column">
                    <div className="layout__panel">A</div>
                </div>
            </div>
        </Container>
    )
}