import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Badge from 'react-bootstrap/Badge';
import { useState } from 'react';
import useStore from '../../store/useStore';
import axios from 'axios'

function ResponsiveNavBar() {
  const [search, setSearch] = useState('')
  const { state } = useStore()

  const handleSearch = async () => {
    try {
      await axios.post("/search", {
        search
      }).then(res => console.log(res.data))
    } catch(err) {
      console.error(err)
    }
  }
  
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Brand href="#">RAYNE</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>RAYNE</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link className='m-2'><p className='navlink'>Account</p></Nav.Link>
                    <Nav.Link className='m-2'><p className='navlink'>Clothes</p></Nav.Link>
                    <Nav.Link className='m-2'><p className='navlink'>Shoes</p></Nav.Link>
                    <Nav.Link className='m-2'>
                      <p className='navlink'>Cart</p>
                      {state.cartItems > 0 && <Badge className='badge_responsive' pill bg="danger">{state.cartItems}</Badge>}
                    </Nav.Link>
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-3"
                    aria-label="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <Button variant="outline-success" onClick={handleSearch}>Search</Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default ResponsiveNavBar;