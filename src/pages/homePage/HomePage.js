import './homePage.scss';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { StateContext } from '../../stateContext/stateContext';

export const HomePage = () => {
    const { users, setUsers } = useContext(StateContext);

    const contactList = users.map((user) => {
        const phones = Object.values(user.phones);
        const firstPhone = `${phones[0].description}: ${phones[0].number}`
        const otherPhones = phones.filter(phone => phone.number !== phones[0].number);
        const firstLetters = `${[...user.first_name][0].toUpperCase()}${[...user.last_name][0].toUpperCase()}`;

        return (
            <Link
              className="user-card"
              to={`/edit/${user.id}`}
              key={user.id}
            >
                <div className="user-name_wrapper">
                    <span className="user-logo">{firstLetters}</span>
                    <span className="user-name">{user.first_name} {user.last_name}</span>
                </div>
                <div className="user-first_phone">
                  {firstPhone}
                </div>
                <div className="user-other_phones">
                  {otherPhones.map(phone => <span key={phone.number}>{phone.description}: {phone.number}</span>)}
                </div>
            </Link>
        );
    });

    return (
        <div className="home-wrapper">
            <h1>Phone Book</h1>
            <div className="contacts-wrapper">
              {contactList}
            </div>
        </div>
    );
};

/**/

/*
id: 0,
  first_name: 'John',
  last_name: 'Dow',
  phones: {
  '+380503332233': { number: '+380503332233', description: 'mobile' },
  '+0482175665': { number: '+0482175665', description: 'work' },
},*/
