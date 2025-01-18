import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer mt-auto bg-dark text-white">
      <div className="container py-4">
        <div className="row">
          <div className="col-12 col-md-4 mb-4 mb-md-0 text-center text-md-start">
            <h4>Openingsuren</h4>
            <p>Maandag - Vrijdag: 9:00 - 17:00</p>
            <p>Zaterdag: 9:00 - 13:00</p>
            <p>Zondag: Gesloten</p>
          </div>

          <div className="col-12 col-md-4 mb-4 mb-md-0 text-center">
            <h4>Contact</h4>
            <p>Telefoon: +32 472 42 58 70</p>
            <p>Email: max.kapsalon@gmail.com</p>
            <p>Adres: Hoogstraat 9, 9340 Lede</p>
          </div>

          <div className="col-12 col-md-4 text-center">
            <h4>Onze Locatie</h4>
            <div className="d-inline-block w-100" style={{ maxWidth: '300px' }}>
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2512.937813144236!2d3.9865417160971086!3d50.95861387954654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3805d34f85abf%3A0x96480b8e6a2b9781!2sHoogstraat%209%2C%209340%20Lede%2C%20Belgium!5e0!3m2!1snl!2sbe!4v1679392367659!5m2!1snl!2sbe"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
