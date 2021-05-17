import './homePage.scss';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { StateContext } from '../../stateContext/stateContext';
import { v4 as uuid_v4 } from 'uuid';

export const HomePage = () => {
    const { users, setUsers } = useContext(StateContext);

    const contactList = users.map((user) => {
        const phones = Object.values(user.phones);
        const firstPhone = `${phones[0].description}: ${phones[0].number}`;
        const otherPhones = phones.filter((phone) => phone.number !== phones[0].number);
        const firstLetters = `${[...user.first_name][0].toUpperCase()}${[
            ...user.last_name,
        ][0].toUpperCase()}`;

        const removeClickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const confirmation = window.confirm('Do you really want to delete this contact?');
            if (!confirmation) return;
            const removeId = e.target.dataset.id;
            console.log(e.target.dataset.id)
            if (!removeId) return;
            const newState = users.filter((user) => user.id !== removeId);
            window.localStorage.setItem('address_book', JSON.stringify(newState));
            setUsers(newState);
        };

        return (
            <Link className="user-card" to={`/edit/${user.id}`} key={user.id} title="Click to edit">
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
                        >
                            <svg
                                data-id={user.id}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="tomato"
                            >
                                <path data-id={user.id} d="M0 0h24v24H0V0z" fill="none" />
                                <path data-id={user.id} d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                            </svg>
                        </div>
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
                <Link className="add-contact" title="Add new" to={`/edit/${uuid_v4()}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7eba8b">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                </Link>
                {contactList}
            </div>
        </div>
    );
};
