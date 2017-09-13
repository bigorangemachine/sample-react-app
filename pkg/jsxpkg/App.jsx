import React from 'react';
import Sidebar from './../ui/Sidebar';
import Header from './../ui/Header';
// import { Redirect } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
// console.log("App props: ",props);
    this.state={
      open_drawer:'no'
    };
    this.RootApp=props.RootApp;
    this.Router={
      computedMatch:props.computedMatch,
      location:props.location
    };
  }
  toggleNav(override, ev){
    ev?ev.preventDefault():null;
    if(typeof(override)!=='undefined'){
      let new_state=override?'yes':'no';
      this.setState({open_drawer: new_state});
    }else{
      let new_state='yes';
      new_state=this.state.open_drawer==='yes'?'no':new_state;
      this.setState({open_drawer: new_state});
    }
  }
  render() {
    let drawer_is_open=this.state.open_drawer==='yes'?true:false,
        // binded_toggle=this.toggleNav.bind(this, undefined),
        wrapper_classname=drawer_is_open?'toggled':'';
    return (<div>
              <Header ref="Header" App={this} RootApp={this.RootApp} />
              <div id="wrapper" className={wrapper_classname}>
                <Sidebar ref="Sidebar" App={this} RootApp={this.RootApp} />
                <main id="page-content-wrapper">
                    <div className="container-fluid">
                    {this.props.children}
                    </div>
                </main>
              </div>
            </div>);
  }
}

export default App;
