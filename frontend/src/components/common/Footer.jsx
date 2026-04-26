const Footer = () => (
  <footer className="mt-20 border-t border-white/10 bg-[#03050e] py-12 text-white/70">
    <div className="container-app grid gap-10 md:grid-cols-4">
      <div>
        <h3 className="text-xl font-bold text-white">Doctor Portal</h3>
        <p className="mt-3 text-sm leading-7 text-white/50">
          Book verified doctors, manage schedules, and keep patient care flowing through one production-ready portal.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-white">Explore</h4>
        <ul className="mt-4 space-y-3 text-sm">
          <li>Home</li>
          <li>Doctors</li>
          <li>Login</li>
          <li>Signup</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white">Services</h4>
        <ul className="mt-4 space-y-3 text-sm">
          <li>Consultation booking</li>
          <li>Doctor approval flow</li>
          <li>Patient reviews</li>
          <li>Online payments</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white">Contact</h4>
        <ul className="mt-4 space-y-3 text-sm">
          <li>support@doctorportal.com</li>
          <li>+91 98765 43210</li>
          <li>Mumbai, India</li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
