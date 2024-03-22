import {Link, useLocation} from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    // Function to check if a link is active
    const isActiveLink = (path) => {
        return location.pathname === path;
    };


    return (
        <div
            className="px-2 bg-neutral-500 bg-opacity-80 backdrop-blur-2xl fixed bottom-0 w-full max-w-full z-10 flex flex-col text-black py-3">
            <div className="grid grid-cols-4 gap-6 ">
                <Link className={`nav-bar-button ${isActiveLink('/library') ? 'active-nav-link' : ''}`} to="/library">
                    <svg className="fill-inherit" width="35" height="35" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_202_2489)">
                            <path
                                d="M22 16V4C22 2.9 21.1 2 20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16ZM11 12L13.03 14.71L16 11L20 16H8L11 12ZM2 6V20C2 21.1 2.9 22 4 22H18V20H4V6H2Z"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_202_2489">
                                <rect width="24" height="24"/>
                            </clipPath>
                        </defs>
                    </svg>

                    {/*<span>*/}
                    {/*    Library*/}
                    {/*</span>*/}
                </Link>
                <Link className={`nav-bar-button ${isActiveLink('/explore') ? 'active-nav-link' : ''}`} to="/explore">
                    <svg className="fill-inherit" width="35" height="35" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_203_2510)">
                            <path
                                d="M9.19 6.34852C7.15 8.63852 5.75 11.9285 5.62 12.2385L2 10.6885L6.05 6.63852C6.52 6.16852 7.2 5.95852 7.86 6.08852L9.19 6.34852ZM11.17 16.9985C11.17 16.9985 14.91 15.4485 17.06 13.2985C22.46 7.89852 21.56 3.67852 21.27 2.72852C20.32 2.42852 16.1 1.53852 10.7 6.93852C8.55 9.08852 7 12.8285 7 12.8285L11.17 16.9985ZM17.65 14.8085C15.36 16.8485 12.07 18.2485 11.76 18.3785L13.31 21.9985L17.36 17.9485C17.83 17.4785 18.04 16.7985 17.91 16.1385L17.65 14.8085ZM9 17.9985C9 18.8285 8.66 19.5785 8.12 20.1185C6.94 21.2985 2 21.9985 2 21.9985C2 21.9985 2.7 17.0585 3.88 15.8785C4.42 15.3385 5.17 14.9985 6 14.9985C7.66 14.9985 9 16.3385 9 17.9985ZM13 8.99852C13 7.89852 13.9 6.99852 15 6.99852C16.1 6.99852 17 7.89852 17 8.99852C17 10.0985 16.1 10.9985 15 10.9985C13.9 10.9985 13 10.0985 13 8.99852Z"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_203_2510">
                                <rect width="24" height="24"/>
                            </clipPath>
                        </defs>
                    </svg>

                    {/*<span>*/}
                    {/*    Explore*/}
                    {/*</span>*/}
                </Link>
                <Link className={`nav-bar-button ${isActiveLink('/albums') ? 'active-nav-link' : ''}`} to="/albums">
                    <svg className="fill-inherit" width="35" height="35" viewBox="0 0 22 27"
                         xmlns="http://www.w3.org/2000/svg">
                        <rect y="8" width="22" height="19" rx="3"/>
                        <path
                            d="M2.05733 4.89486C2.05733 4.28451 2.65789 4 3.39871 4H18.6011C19.4956 3.99999 19.9424 4.28451 19.9424 4.89486C19.9424 5.50521 20.2364 6 19.4956 6H2.50472C1.76391 6 2.05733 5.50521 2.05733 4.89486Z"/>
                        <path
                            d="M4.04459 0.894863C4.04459 0.284513 4.51169 3.04003e-10 5.08788 3.04003e-10H16.9119C17.6077 -1.0739e-05 17.9552 0.284513 17.9552 0.894863C17.9552 1.50521 18.1839 2 17.6077 2H4.39256C3.81637 2 4.04459 1.50521 4.04459 0.894863Z"/>
                    </svg>

                    {/*<span>*/}
                    {/*    Albums*/}
                    {/*</span>*/}

                </Link>
                <Link className={`nav-bar-button ${isActiveLink('/account') ? 'active-nav-link' : ''}`}  to="/account">
                    <svg className="fill-inherit" width="35" height="35" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_202_2493)">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 7.57 19.18 5.86 17.12C7.55 15.8 9.68 15 12 15C14.32 15 16.45 15.8 18.14 17.12C16.43 19.18 14.03 20 12 20Z"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_202_2493">
                                <rect width="24" height="24" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>

                    {/*<span>*/}
                    {/*    Account*/}
                    {/*</span>*/}
                </Link>
            </div>
        </div>
    );
}

export default Navbar;


// import { Link, useMatch, useResolvedPath } from "react-router-dom"
//
// export default function Navbar() {
//     return (
//         <nav className="nav">
//             <Link to="/" className="site-title">
//                 Site Name
//             </Link>
//             <ul>
//                 <CustomLink to="/pricing">Pricing</CustomLink>
//                 <CustomLink to="/about">About</CustomLink>
//             </ul>
//         </nav>
//     )
// }
//
// function CustomLink({ to, children, ...props }) {
//     const resolvedPath = useResolvedPath(to)
//     const isActive = useMatch({ path: resolvedPath.pathname, end: true })
//
//     return (
//         <li className={isActive ? "active" : ""}>
//             <Link to={to} {...props}>
//                 {children}
//             </Link>
//         </li>
//     )
// }
