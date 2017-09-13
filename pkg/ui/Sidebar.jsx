import React from 'react';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
console.log("props ",props)
    this.App=props.App;
    this.RootApp=props.RootApp;
    // this.binded={};

  }

  componentWillUnmount(){
  }
  componentDidMount(){
  }
  buildItems(){
    var self=this,
        output=[],
        menu_list={
          home:{
            label:'Home',
            route_link:'/',
            click_action:null,
            className:''
          },
          abc1:{
            label:'#1',
            route_link:'/abc1',
            click_action:null,
            className:''
          },
          def2:{
            label:'#2',
            route_link:'/def2',
            click_action:null,
            className:''
          },
          xyz:{
            label:'404',
            route_link:'/xyz',
            click_action:null,
            className:''
          }
        };
    for(var k in menu_list){
      output.push((function(key){
        let item=menu_list[key],
            click_action=self.onClick.bind(self, item);
        return <li key={"menuitem-"+key}><a
                  onClick={click_action} href={item.route_link}
                  className={"sidebar--item" + item.className>0?' '+item.className:''}>
                    {item.label}
              </a></li>;
      })(k));
    }
    return output;
  }
  onClick(item, ev){
    ev.preventDefault();
    this.RootApp.redirectURI(item.route_link);
    this.App.toggleNav(false);
  }

  render () {
    var self=this,
        app_click=self.App.toggleNav.bind(self.App, undefined),
        menu_items=self.buildItems();
// <AppBar title={this.RootApp.state.page_title} iconClassNameLeft="js-hide" iconElementRight={<IconButton onClick={app_click}><MoreVert /></IconButton>}/>
    return <div id="sidebar-wrapper">
              <ul className="sidebar-nav">
                  {menu_items}
              </ul>
          </div>;//<i class="icon ion-home"></i>
  }
}
export default Sidebar;
