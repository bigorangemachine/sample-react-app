import React from 'react';
import { ProgressBar, Alert } from 'react-bootstrap';
import AjaxCall from '../jsxpkg/ApiCall';

class ActiveElement extends React.Component {

  constructor(props) {
    super(props);
    this.intervals={
      timeout_ready:null
    };
    this.state = {
      records:null,
      status:'ready',
      error:null
    };

    this.DefaultCall=props.DefaultCall?props.DefaultCall:'popular';
    this.AutoDone=props.AutoDone?true:false;//automatically change status state
    this.AutoError=props.AutoError?true:false;//automatically change error state
    this.ajax=Object.assign({},
                props.ajax && props.ajax.constructor===Object?props.ajax:{}, {
                popular:AjaxCall.popularMovies.bind(AjaxCall),
                id:AjaxCall.movieId.bind(AjaxCall)
              });

  }

  componentWillUnmount(){
    for(var k in this.intervals){
      if(this.intervals[k] && k.startsWith('animation')){
        cancelAnimationFrame(this.intervals[k]);
      }else if(this.intervals[k] && k.startsWith('timeout')){
        clearTimeout(this.intervals[k]);
      }
    }
  }
  componentWillMount(){
    var self=this;
    self.ajaxCall(this.DefaultCall, null, function(err,data){
        if(!err){
          self.setState({records:data});
        }
    });
  }
  componentDidMount(){
  }
  ajaxCall(slug, data, callback){
    var self=this;
    if(self.state.status==='ready'){
      self.setupReady(() => {
        self.ajax[slug](data).then(function(res){
          do_done();
          callback(null, res.data);
        }).catch(function(err){
          if(self.AutoError){
            self.setState({
              error:err
            });
          }
          do_done();
          callback(err, null);
        });
      });
    }
    function do_done(){
      if(self.AutoDone){
        self.setupDone();
      }
    }
  }
  setupReady(callback){
    var self=this;
    if(self.state.status==='ready' && !self.intervals.timeout_ready){
      self.setState({
        status:'busy',
        error:null
      });
      self.intervals.timeout_ready=setTimeout(function(){
        callback();
      }, 666);
    }
  }
  setupDone(){
    var self=this;
    if(self.intervals.timeout_ready!==null){
      self.intervals.timeout_ready=null;
      self.setState({
        status:'ready'
      });
    }
  }

  progress(){
    return this.state.status==='busy'?<ProgressBar active now={100} />:null;
  }
  errorMsg(){
    return this.state.error?<Alert bsStyle="warning">
                {this.state.error instanceof Error?this.state.error.message:this.state.error}
            </Alert>:null;
  }

  render () {
    return <div>
            <div style="position:fixed;top:0px;left:0px;right:0px;height:4.5rem;">{this.progress()}</div>
            {this.errorMsg()}
            {this.props.children}
            {this.progress()}
          </div>;
  }
}

export default ActiveElement;
