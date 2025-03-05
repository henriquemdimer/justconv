import Container from "../Container/index.tsx";
import "./index.scss";

export default function Navbar() {
  return (
    <Container>
      <nav id="navbar">
        <div id="brand">
          <h3>JustConv</h3>
        </div>
        <div id="actions"></div>
      </nav>
    </Container>
  );
}
