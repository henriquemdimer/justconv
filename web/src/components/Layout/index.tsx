import Button from "../Button/index.tsx";
import Container from "../Container/index.tsx";
import { Panel } from "../Panel/index.tsx";
import Sidebar from "../Sidebar/index.tsx";
import { FaSolidArrowUpRightFromSquare } from "solid-icons/fa";
import "./index.scss";
import DragNDrop from "../DragNDrop/index.tsx";
import NotImplAlert from "../NotImplAlert/index.tsx";

export default function Layout() {
  return (
    <Container class="full-height">
      <div id="layout">
        <div class="flex full-width gap">
          <div class="sidebar flex flex-column gap">
            <Panel>
              <Sidebar />
            </Panel>
            <Panel small>
              <div id="self-host" class="flex flex-column">
                <h3>Self host</h3>
                <p>
                  Did you know that you can self-host this service on your own
                  servers? Check out our GitHub repository.
                </p>
                <Button
                  label="Github"
                  leftIcon={<FaSolidArrowUpRightFromSquare />}
                />
              </div>
            </Panel>
          </div>
          <Panel dynamic>
            <div class="flex full-height flex-column gap">
              <div class="row flex flex-column gap">
                <small class="small-text">Conversion queue</small>
                <DragNDrop />
              </div>
            </div>
          </Panel>
          <Panel class="sidebar">
            <div class="full-height">
              <NotImplAlert />
            </div>
          </Panel>
        </div>
      </div>
    </Container>
  );
}
