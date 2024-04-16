import Container from "react-bootstrap/Container";


function PageTitle() {
  return (
    <section id="home" className="hero-block">
      <Container fluid className="title-container">
        <div className="title-bar">
          <h1 className="title">Research Nexus</h1>
          <center>
            <p>
              An Online Research Repository of Naga College Foundation, Inc.
            </p>
          </center>
        </div>
      </Container>
    </section>
  );
}

export default PageTitle;
