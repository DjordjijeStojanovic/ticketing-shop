import Link from 'next/link';

const Header = ({ user }) => {
    const links = [
        !user && { label: 'Sign Up', href: '/auth/signup' },
        !user && { label: 'Sign In', href: '/auth/signin' },
        user && { label: 'Sign Out', href: '/auth/signout' }
    ].filter((linkConfig) => {
        return linkConfig;
    }).map(({ label, href }) => {
        return (
            <>
                <li key={href} className='nav-item'>
                    <Link href={href} className='nav-link'>{label}</Link>
                </li>
            </>
        )
    });

    return (
        <>
            <nav className='navbar navbar-light bg-light'>
                <Link className='navbar-brand' href='/'>
                    TicketShop
                </Link>
                <div className='d-flex justify-content-end'>
                    <ul className='align-items-center d-flex nav'>
                        {links}
                    </ul>
                </div>
            </nav>
        </>
    )
};

export default Header;