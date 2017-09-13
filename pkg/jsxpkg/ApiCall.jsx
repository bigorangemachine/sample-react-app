import axios from 'axios';


class ApiCall {
  constructor(opts) {
  }
  popularMovies(){
    return axios.get('/api/popular');
  }
  movieId(id){
    return axios.get('/api/movie/'+id);
  }
}


  export default new ApiCall();
