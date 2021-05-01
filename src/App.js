import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

import Form from './FormContacts/Form';
import Contacts from './Contacts/Contacts';
import Filter from './Filter/Filter';

class App extends React.Component {
  state = {
    contacts: [],
    filter: '',
  };

  addToLibrary = data => {
    const { name, number } = data;
    const nameLowerCase = name.toLowerCase();
    const contactsList = this.state.contacts;

    const contact = {
      id: uuidv4(),
      name: name,
      number: number,
    };
    const checkDuplicate = contactsList.find(
      contact => contact.name.toLowerCase() === nameLowerCase,
    );
    checkDuplicate
      ? alert(`${name} is alredy in contacts`)
      : this.setState(({ contacts }) => ({
          contacts: [contact, ...contacts],
        }));
  };
  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };
  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLocaleLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );
  };

  deleteById = id => {
    this.setState(({ contacts }) => {
      return {
        contacts: contacts.filter(contact => contact.id !== id),
      };
    });
  };
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {this.setState({ contacts: parsedContacts });}
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }
  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();

    return (
      <div className="container">
        <h1>Phonebook</h1>
        <Form
          // duplicateSearch={this.duplicateSearch}
          addToLibrary={this.addToLibrary}
        />
        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.changeFilter} />
        <Contacts
          libraryContacts={visibleContacts}
          onDelete={this.deleteById}
        />
      </div>
    );
  }
}

App.propTypes = {
  state: PropTypes.shape({
    contacts: PropTypes.array,
    filter: PropTypes.string,
  }),

  changeFilter: PropTypes.func,
  getVisibleContacts: PropTypes.func,
  deleteById: PropTypes.func,
  addToLibrary: PropTypes.func,
  duplicateSearch: PropTypes.func,
};

export default App;
