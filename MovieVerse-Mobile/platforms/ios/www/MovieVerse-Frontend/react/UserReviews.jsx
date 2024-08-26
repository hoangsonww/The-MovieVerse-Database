import React, { Component } from 'react';

class UserReviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: props.movieId,
      reviews: [],
      error: null,
    };
  }

  componentDidMount() {
    fetch(`https://movie-verse.com/movies/${this.state.movieId}/reviews`)
      .then(response => response.json())
      .then(data => this.setState({ reviews: data }))
      .catch(error => this.setState({ error }));
  }

  renderReviews() {
    const { reviews } = this.state;
    if (!reviews.length) return <p>No reviews yet.</p>;

    return reviews.map((review, index) => (
      <div key={index} className="review">
        <h4>{review.user}</h4>
        <p>{review.comment}</p>
        <p>Rating: {review.rating} / 5</p>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <h3>User Reviews</h3>
        {this.renderReviews()}
      </div>
    );
  }
}

export default UserReviews;
