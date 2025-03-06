import Container from "../Container/index.tsx";
import { Panel } from "../Panel/index.tsx";
import "./index.scss";

export default function Layout() {
  return (
    <Container class="full-height">
      <div id="layout">
        <div class="flex full-width">
          <div class="flex column">
            <Panel />
            <Panel small />
          </div>
		  <Panel dynamic />
		  <Panel />
        </div>
      </div>
    </Container>
  );
}
