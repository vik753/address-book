import './homePage.scss';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { StateContext } from '../../stateContext/stateContext';

export const HomePage = () => {
    const { users, setUsers } = useContext(StateContext);

    const contactList = users.map((user) => {
        const phones = Object.values(user.phones);
        const firstPhone = `${phones[0].description}: ${phones[0].number}`;
        const otherPhones = phones.filter(
            (phone) => phone.number !== phones[0].number
        );
        const firstLetters = `${[...user.first_name][0].toUpperCase()}${[
            ...user.last_name,
        ][0].toUpperCase()}`;

        const removeClickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const confirmation = window.confirm('Do you really want to delete this contact?');
            if (!confirmation) return;
            const removeId = e.target.dataset.id;
            if (!removeId) return;
            const newState = users.filter((user) => user.id !== removeId);
            console.log(newState, user.id, removeId)
            setUsers(newState);
        };

        return (
            <Link
                className="user-card"
                to={`/edit/${user.id}`}
                key={user.id}
                title="Click to edit"
            >
                <div className="user-name_wrapper">
                    <div>
                        <span className="user-logo">{firstLetters}</span>
                        <span className="user-name">
                            {user.first_name} {user.last_name}
                        </span>
                    </div>
                    <div className="user-name_inner-wrapper">
                        <div className="user-first_phone">{firstPhone}</div>
                        <div
                            className="remove-contact"
                            title="Remove contact"
                            data-id={user.id}
                            onClick={removeClickHandler}
                        />
                    </div>
                </div>
                {phones.length > 1 && (
                    <>
                        <div className="more-phones">more phones...</div>
                        <div className="user-other_phones">
                            {otherPhones.length
                                ? otherPhones.map((phone) => (
                                      <span key={phone.number}>
                                          {phone.description}: {phone.number}
                                      </span>
                                  ))
                                : 'no more phones here...'}
                        </div>
                    </>
                )}
            </Link>
        );
    });

    return (
        <div className="home-wrapper">
            <h1>Phone Book</h1>
            <div className="contacts-wrapper">
                <div className="add-contact" title="Add new" />
                {contactList}
            </div>
        </div>
    );
};
