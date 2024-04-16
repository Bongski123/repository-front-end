import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { Link } from "react-router-dom";

export default function Categories () {

    const importAll = (r) => r.keys().map(r);
    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg)$/));

    const cardContent = [
        {
          title: "College of Computer Studies",
          color: "",
          link: "/CCS",
          image: images.find(image => image.includes('ccs'))
        },
        {
          title: "College of Arts and Sciences",
          color: "",
          link: "/CAS",
          image: images.find(image => image.includes('cas'))
        },
        {
          title: "College of Teacher Education",
          color: "",
          link: "/CTED",
          image: images.find(image => image.includes('cted'))
        },
        {
          title: "College of Criminal Justice Education",
          color: "",
          link: "/results/secondary",
          image: images.find(image => image.includes('ccje'))
        },
        {
          title: "College of Business and Management",
          color: "",
          link: "/results/secondary",
          image: images.find(image => image.includes('cbm'))
        },
        {
          title: "College of Accountancy and Finance",
          color: "",
          link: "/results/secondary",
          image: images.find(image => image.includes('caf'))
        },
        {
          title: "College of Health Sciences",
          color: "",
          link: "/CHS",
          image: images.find(image => image.includes('chs'))
        },
        {
          title: "College of Engineering",
          color: "",
          link: "/COE",
          image: images.find(image => image.includes('coe'))
        },
        {
          title: "Graduate Studies",
          color: "",
          link: "/results/secondary",
          image: images.find(image => image.includes('gs'))
        },
        {
          title: "Faculty and Other Researchers",
          color: "",
          link: "/results/secondary",
          image: images.find(image => image.includes('ncfi'))
        },
      ];

    return (
      <section id="categories" className="block categories-block">
      <Container fluid className="categories-container">
          <div className="title-bar">
              <h1 className="title">Categories</h1>
          </div>
      </Container>

      <Container>
      <h2 className="category-card-title">Browse by Department</h2>
      <p></p>

      <Row xs={1} md={2} lg={5} className="g-2">
          {cardContent.map((content, idx) => (
              <Col key={idx}>
              <Link to={content.link} style={{ textDecoration: 'none', color: 'inherit'}}>
                  <Card border={content.color}>
                      <Card.Img variant="top"  src={content.image}/>
                      <Card.Body>
                          <Card.Title style={{ fontSize: '1.1em', textAlign: 'center' }}>
                              {content.title}
                          </Card.Title>
                      </Card.Body>
                  </Card>
              </Link>
              </Col>
          ))}
      </Row>
          
      </Container>
  </section>
)
}