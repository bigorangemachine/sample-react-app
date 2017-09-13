import React from 'react';
import merge from 'merge';
import moment from 'moment';
import ActiveElement from './ActiveElement';

class Movie extends ActiveElement {

  constructor(props) {
    super(props);
    this.state=merge(true,this.state,{
      id:props.match.params.id,
      title:props.Title,
      overview:props.Overview,
      poster:props.Poster,
      poster_medium:props.PosterMedium,
      poster_large:props.PosterLarge,
      release_date:props.ReleaseDate,
      runtime:props.RunTime,
      vote_average:props.VoteAverage
    });
// console.log("MOVIE PROPS: ",this.state);
    this.RootApp=props.RootApp;
    // this.App=this.RootApp.refs.App;

    this.AutoDone=true;
    this.AutoError=true;
    this.DefaultCall='id';
  }

  updateMovie(movie){
console.log("updateMovie: ")
    if(movie){
      this.setState({
        id:movie.id,
        title:movie.title,
        overview:movie.overview,
        poster:movie.poster,
        poster_medium:movie.poster_medium,
        poster_large:movie.poster_large,
        release_date:movie.release_date,
        runtime:movie.runtime,
        vote_average:movie.vote_average
      });
    }
  }
  componentWillMount(){
    var self=this;
    self.ajaxCall(this.DefaultCall, this.state.id, function(err,data){
        if(!err){
console.log("WILL MOUNT");
          self.setState({records:data});
          self.updateMovie(data.payload?data.payload[0]:{});
        }
    });
  }

  render () {
// console.log("MOVIE state: ",this.state,this.state.vote_average);
    return <div className="Movie">
            <h3>{this.state.title}</h3>
            {this.errorMsg()}
            <article>
              {this.progress()}
              <img className="poster" src={this.state.poster_medium} />
              <section className="glanceDetails">
                <p className="dateReleased">{moment(this.state.release_date).format("YYYY")}</p>
                <p className="duration">{this.state.runtime} min</p>
                <p className="rating">{this.state.vote_average}/10</p>
                <button className="btn btn-info">Mark as favorite</button>
              </section>
              <p className="overview">{this.state.overview}</p>
            </article>

          </div>;
  }
}
export default Movie;
