import { Navbar,Nav, Container, NavbarBrand, NavDropdown, Badge } from "react-bootstrap";
import {FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux';
import { LinkContainer } from "react-router-bootstrap";
import { useLogoutMutation } from "../slices/usersApiSlice";
import {logout} from '../slices/authSlice.js'
import {useNavigate} from 'react-router-dom'

const Header = () => {
    const {userInfo} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();
    const logoutHandler = async () => {
        try{
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/')
        }catch(error){
            console.log(error);
        }
    }
    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnselect>
                <Container>
                    <LinkContainer to='/'>
                    <Navbar.Brand>Auth</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className="ms-auto">
                            { userInfo?(
                                <>
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>
                                            Profile
                                        </NavDropdown.Item>                                    
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>
                                </NavDropdown>
                                </>
                            ):(
                                <>
                                <LinkContainer to='/login'>
                            <Nav.Link>
                                <FaSignInAlt/>Sign in 
                            </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to='/register'>
                            <Nav.Link>
                                <FaSignOutAlt/> Sign up
                            </Nav.Link>
                            </LinkContainer>
                                </>
                            ) }
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}
export default Header;