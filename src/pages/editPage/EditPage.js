import { useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { StateContext } from '../../stateContext/stateContext';
import './editPage.scss';

export const EditPage = () => {
    const { users, setUsers } = useContext(StateContext);
    const [currentUser, setCurrentUser] = useState(null);
    const { id } = useParams();
    const userDataEl = useRef(null);
    const [numPhones, setNumPhones] = useState(0);

    useEffect(() => {
        if (!id) return;

        const targetUser = users.filter((user) => user.id === id);
        if (targetUser.length) {
            setCurrentUser(targetUser);
        }
        addPhoneHandler();
    }, []);

    const getTemplate = (num) => {
        return `
            <div class="user-data_row phone-row phone-row_${num}" data-phoneid=${num}>
                <label for=${`phone_${num}`}>Phone:*</label>
                <div>
                    <select
                        name="phone-type"
                        class="phone-type"
                        id=${`phone_${num}_select`}
                    >
                        <option value="mobile">Mobile</option>
                        <option value="work">Work</option>
                        <option value="home">Home</option>
                        <option value="car">Car</option>
                    </select>
                    <input
                        id=${`phone_${num}`}
                        type="text"
                        placeholder="Phone"
                    />
                </div>
            </div>
        `;
    };

    const addPhoneHandler = () => {
        if (!userDataEl.current) return;
        userDataEl.current.insertAdjacentHTML('beforeend', getTemplate(numPhones + 1));
        setNumPhones((state) => ++state);
    };

    const removePhoneHandler = () => {
        if (numPhones === 1) return;
        const el = document.querySelector(`.phone-row_${numPhones}`);
        if (!el) return;
        el.remove();
        setNumPhones(state => state - 1);
    };



    return (
        <div className="edit-wrapper">
            <h1>Edit Contact</h1>
            <div className="user-data" ref={userDataEl}>
                <div
                    className="add-phone"
                    title="Add new phone"
                    onClick={addPhoneHandler}
                />
                <div
                    className="remove-phone"
                    title="Remove phone"
                    onClick={removePhoneHandler}
                    disabled={numPhones === 1}
                />
                <div className="user-data_row">
                    <label htmlFor="firstName">First Name:*</label>
                    <input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                    />
                </div>
                <div className="user-data_row">
                    <label htmlFor="lastName">Last Name:*</label>
                    <input id="lastName" type="text" placeholder="Last Name" />
                </div>
            </div>
        </div>
    );
};

/*
{
    id: 0,
    first_name: 'John',
    last_name: 'Dow',
    phones: {
        '+380503332233': { number: '+380503332233', description: 'mobile' },
        '+0482175665': { number: '+0482175665', description: 'work' },
    },
},
* */
