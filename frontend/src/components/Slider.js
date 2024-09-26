import Carousel from 'react-bootstrap/Carousel';
import image from '../images/clothes8.jpg'
import image2 from '../images/clothes5.jpg'
import image3 from '../images/clothes6.jpg'

function Slider() {
  return (
    <div className='slider'>
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image2}
              alt="First slide"
            />
            {/* <Carousel.Caption>
              <h3>Vintage</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption> */}
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image}
              alt="Second slide"
            />
            {/* <Carousel.Caption>
              <h3>Warm and hug</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption> */}
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image3}
              alt="Third slide"
            />
            {/* <Carousel.Caption>
              <h3>Slay every day</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption> */}
          </Carousel.Item>
        </Carousel>
    </div>
  );
}

export default Slider;