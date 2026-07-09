import Link from "next/link";
import styles from '../styles/header.module.css'

const Header = ({ user }) => {
  const links = [
    !user && { label: "Sign Up", href: "/auth/signup" },
    !user && { label: "Sign In", href: "/auth/signin" },
    user && { label: 'Sell a ticket', href: '/tickets/new' },
    user && { label: 'My Orders', href: '/orders' },
    user && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => {
      return linkConfig;
    })
    .map(({ label, href }) => {
      return (
        <li key={href} className={`nav-item ${styles.navItem}`}>
          <Link href={href} className={`nav-link ${styles.navBarLink}`}>
            {label}
          </Link>
        </li>
      );
    });

  return (
    <>
      <nav className={`navbar navbar-light bg-light ${styles.navMain}`}>
        <Link className={`navbar-brand ${styles.brandName}`} href="/">
          TicketShop
        </Link>
        <div className="d-flex justify-content-end">
          <ul className={`align-items-center d-flex nav ${styles.ulNav}`}>{links}</ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
