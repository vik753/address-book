import './header.scss';
import { Link } from 'react-router-dom';
export const Header = () => {
    return (
        <div className="header">
            <div className="header-wrapper">
                <h2 className="logo">Logo</h2>
                <div className="links">
                    <Link to={'/'} className="link">
                        Home
                    </Link>
                    <Link className="link">About</Link>
                    <Link className="link">Contacts</Link>
                </div>
            </div>
        </div>
    );
};
