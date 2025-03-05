import "./App.scss";

import Container from "./components/Container/index.tsx";
import Navbar from "./components/Navbar/index.tsx";
import * as Panel from "./components/Panel/index.tsx";
import * as Queue from "./components/Queue/index.tsx";
import Line from "./components/Line/index.tsx";

export default function App() {
  return (
    <>
      <Line text="Host this service yourself" />
      <Navbar />
      <Container>
        <div class="conversor__panel">
          <Panel.Container>
            <Panel.Header>
              <Queue.Header title="Conversion queue" />
            </Panel.Header>
            <Panel.Footer>
              <Panel.Button />
            </Panel.Footer>
          </Panel.Container>
          <Panel.Container>
            <Panel.Header>
              <Queue.Header title="Conversions done" />
            </Panel.Header>
          </Panel.Container>
        </div>
      </Container>
    </>
  );
}
