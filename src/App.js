import React, { Component } from "react";
import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";

class App extends Component {
  state = {
    currentAuthor: null,
    filteredAuthors: [],
    authors: [],
    loading: true
  };

  selectAuthor = async author => {
    this.setState({ loading: true });
    try {
      let ID = author.id;
      const fetchData = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/" + ID
      );
      this.setState({ currentAuthor: fetchData.data, loading: false });
    } catch (error) {
      console.error(error);
    }
  };
  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${this.state.authors.first_name} ${this.state.authors.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.loading) {
      return <h1>"Loading"</h1>;
    } else if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      return (
        <AuthorsList
          authors={this.state.filteredAuthors}
          selectAuthor={this.selectAuthor}
          filterAuthors={this.filterAuthors}
        />
      );
    }
  };

  async componentDidMount() {
    try {
      const fetchData = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );
      this.setState({ loading: false });
      this.setState({ authors: fetchData.data });
      this.setState({ filteredAuthors: fetchData.data });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
