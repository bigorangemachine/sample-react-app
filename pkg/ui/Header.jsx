import React from 'react';
import { Navbar, NavItem, Nav } from 'react-bootstrap';


class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.App=props.App;
    this.RootApp=props.RootApp;

  }

  componentWillUnmount(){
  }
  componentDidMount(){
  }

  render () {
    var self=this,
        app_click=self.App.toggleNav.bind(self.App, undefined);
    return <Navbar className="header">
              <Nav pullLeft>
                <NavItem>{this.RootApp.state.page_title}</NavItem>
              </Nav>
            <Nav pullRight>
              <NavItem onClick={app_click} href="#"><i className="mi mi-more-vert"></i></NavItem>
            </Nav>
            </Navbar>;
  }
}
export default Header;
