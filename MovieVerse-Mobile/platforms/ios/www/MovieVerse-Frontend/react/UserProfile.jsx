import React, { Component } from 'react';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      profile: null,
      loading: true,
      error: null,
      editing: false,
    };
  }

  componentDidMount() {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    fetch(`https://movie-verse.com/users/${this.state.userId}`)
      .then(response => response.json())
      .then(data => this.setState({ profile: data, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
  }

  handleEditToggle = () => {
    this.setState(prevState => ({ editing: !prevState.editing }));
  };

  handleSave = updatedProfile => {
    // API call to update user profile
    fetch(`https://movie-verse.com/users/${this.state.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ profile: data, editing: false });
      })
      .catch(error => this.setState({ error }));
  };

  renderProfileView() {
    const { profile } = this.state;
    return (
      <div>
        <h2>{profile.name}</h2>
        <p>Email: {profile.email}</p>
        <p>Favorite Genre: {profile.favoriteGenre}</p>
        <p>Favorite Movies: {profile.favoriteMovies.join(', ')}</p>
        <p>Favorite Actors: {profile.favoriteActors.join(', ')}</p>
        <p>Favorite Directors: {profile.favoriteDirectors.join(', ')}</p>
        <button onClick={this.handleEditToggle}>Edit Profile</button>
      </div>
    );
  }

  renderProfileEdit() {
    const { profile } = this.state;
    this.setState({ editing: true });
  }

  render() {
    const { loading, error, editing } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading profile.</p>;

    return <div>{editing ? this.renderProfileEdit() : this.renderProfileView()}</div>;
  }
}

export default UserProfile;
