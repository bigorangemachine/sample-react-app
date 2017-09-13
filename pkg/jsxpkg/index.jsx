//styles first please
import 'minireset.css/minireset.sass';
import 'material-icons/css/material-icons.css';
import './../css/app.css';
import './../scss/core.scss';
import './../scss/core-UI.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'startbootstrap-simple-sidebar/css/simple-sidebar.css';

//react stuff
import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter, Route, Redirect, Link, Switch } from 'react-router-dom';

import App from './App';
import Grid from '../ui/Grid';
import Movie from '../ui/Movie';

//custom modules
import utils from 'bom-utils';

//root Component
class RootApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page_title:'',
      redirect_path:null
    };
  }

  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){
    if(this.state.page_title.length===0){
      this.setPageTitle("Welcome");
    }
  }
  redirectURI(str){
    this.setState({redirect_path:str});
  }
  setPageTitle(str){
    this.setState({page_title:str});
  }

  render () {
    let self=this,
        redirect_el=this.state.redirect_path?<Redirect push to={this.state.redirect_path} />:null,
        Home = () => (<Grid RootApp={self}></Grid>);

    return <BrowserRouter ref="Router">
                <Switch>
                  <App ref="App" RootApp={this}>
                    {redirect_el}
                    <Route exact path="/" component={Home} />
                    <Route exact path="/movie/:id" component={Movie} RootApp={this} />
                  </App>
                </Switch>
            </BrowserRouter>;
    // <Route path="/def2" component={EmptyEl} />
  }
}
const EmptyEl = () => (<h3>!EMPTY!</h3>);
const AppRouter = () => (<h3>Welcome</h3>);

/* istanbul ignore if */
if(!process || !process.env || !process.env.NODE_ENV || !process.env.NODE_ENV.startsWith('test')){
    render(<RootApp/>, (document.querySelectorAll('.app').length>0?document.querySelectorAll('.app')[0]:document.body));
}

export default RootApp;
