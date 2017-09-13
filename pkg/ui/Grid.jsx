import React from 'react';
import merge from 'merge';
import ActiveElement from './ActiveElement';

class Grid extends ActiveElement {

  constructor(props) {
    super(props);
    this.state=merge(true,this.state,{});
    this.App=props.App;
    this.RootApp=props.RootApp;
    this.AutoDone=true;
    this.AutoError=true;

  }

  componentWillUnmount(){
  }
  componentDidMount(){
  }
  buildItems(){
    let root_app=this.RootApp;
    if(!this.state.records || this.state.records.payload.length===0){return null;}
    return this.state.records.payload.map(function(item, index){
      return <GridItem key={"grid-item-"+index} ID={item.id} Title={item.title} Poster={item.poster_medium} RootApp={root_app} />
    });

  }

  render () {
    return <div className="grid">
            {this.errorMsg()}
            {this.buildItems()}
            {this.progress()}
          </div>;
  }
}
class GridItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      id:props.ID,
      title:props.Title,
      overview:props.Overview,
      poster:props.Poster
    };
    this.RootApp=props.RootApp;
  }
  onClick(item, ev){
    ev.preventDefault();
    this.RootApp.redirectURI(item.route_link);
  }

  render () {
    let uri="/movie/"+this.state.id,
        click_action=this.onClick.bind(this, {route_link:uri});
    return <div className="gridItem">
            <a href={uri} onClick={click_action}><img src={this.state.poster} /></a>
          </div>;
  }
}
export default Grid;
