import validator from 'validator';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { StateContext } from '../../stateContext/stateContext';
import { useHistory } from 'react-router-dom';
import './editPage.scss';
import { v4 as uuid_v4 } from 'uuid';
import _ from 'lodash';

export const EditPage = () => {
    let history = useHistory();
    const { users, setUsers } = useContext(StateContext);
    const [currentUser, setCurrentUser] = useState(null);
    const { id } = useParams();
    const userDataEl = useRef(null);
    const removeIco = useRef(null);
    const [numPhones, setNumPhones] = useState(0);
    const [isNamesValid, setIsNamesValid] = useState({
        first_name: true,
        last_name: true,
    });
    const [isPhonesValid, setIsPhonesValid] = useState({});

    useEffect(() => {
        if (!id) return;

        const targetUser = users.filter((user) => user.id === id);
        if (targetUser.length) {
            setCurrentUser(targetUser[0]);
            const startIsValidPhones = {};
            Object.keys(targetUser[0].phones).map((key) => {
                startIsValidPhones[key] = true;
            });
            setIsPhonesValid(startIsValidPhones);
        } else {
            setCurrentUser({
                id,
                first_name: '',
                last_name: '',
                phones: {
                    [uuid_v4()]: { number: '', description: 'mobile' },
                },
            });
        }
    }, []);

    const addPhoneHandler = (e) => {
        e.preventDefault();
        const phoneKey = uuid_v4();
        if (!phoneKey) return;
        setCurrentUser((prevData) => ({
            ...prevData,
            phones: {
                ...prevData.phones,
                [phoneKey]: {
                    description: 'mobile',
                    number: '',
                },
            },
        }));
    };

    const phoneInputHandler = (e) => {
        e.preventDefault();
        const phoneKey = e.target.id;
        if (!phoneKey) return;
        setCurrentUser((prevData) => ({
            ...prevData,
            phones: {
                ...prevData.phones,
                [phoneKey]: {
                    description: prevData.phones[phoneKey].description,
                    number: e.target.value,
                },
            },
        }));
    };

    const phoneSelectChangeHandler = (e) => {
        e.preventDefault();
        const phoneKey = e.target.dataset.id;
        setCurrentUser((prevData) => ({
            ...prevData,
            phones: {
                ...prevData.phones,
                [phoneKey]: {
                    description: e.target.value,
                    number: prevData.phones[phoneKey].number,
                },
            },
        }));
    };

    const nameChangeHandler = (e) => {
        e.preventDefault();
        const id = e.target.dataset.id;
        if (!id) return;

        setCurrentUser((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };

    const removePhoneHandler = (e) => {
        e.preventDefault();
        const phoneKey = e.target.dataset.id;
        const newPhones = Object.assign({}, currentUser.phones);
        delete newPhones[phoneKey];
        setCurrentUser((prevState) => ({
            ...prevState,
            phones: newPhones,
        }));
    };

    const cancelBtnHandler = (e) => {
        e.preventDefault();
        history.push('/');
    };

    const isDataValid = () => {
        const { first_name, last_name, phones } = currentUser;
        const isPhonesValid = {};
        Object.entries(phones).map(([key, value]) => {
            isPhonesValid[key] = validator.isMobilePhone(
                value.number.replaceAll('-', '')
            );
        });
        setIsPhonesValid(isPhonesValid);
        const isPhValid = _.every(isPhonesValid, Boolean);

        const isNamesValid = {
            first_name: validator.isLength(first_name, { min: 2, max: 24 }),
            last_name: validator.isLength(last_name, { min: 2, max: 24 }),
        };
        setIsNamesValid(isNamesValid);
        const isNamesVal = _.every(isNamesValid, Boolean);
        return isPhValid && isNamesVal;
    };

    const saveBtnHandler = (e) => {
        e.preventDefault();

        const isValid = isDataValid();
        console.log('isValid', isValid);
        if (!isValid) {
            return;
        }

        if (users.find((user) => user.id === currentUser.id)) {
            setUsers((prevState) =>
                prevState.map((user) => {
                    if (user.id === currentUser.id) {
                        return currentUser;
                    }
                    return user;
                })
            );
        } else {
            setUsers((prevState) => [...prevState, currentUser]);
        }

        history.push('/');
    };

    const getPhoneRow = (phoneKey) => {
        if (removeIco.current) {
            removeIco.current.setAttribute('data-id', phoneKey);
        }
        return (
            <div
                key={phoneKey}
                className={`user-data_row phone-row phone-row_${phoneKey}`}
                data-phoneid={phoneKey}
            >
                <label htmlFor={phoneKey}>Phone:*</label>
                <div>
                    <select
                        name="phone-type"
                        className="phone-type"
                        data-id={phoneKey}
                        value={currentUser.phones[phoneKey].description}
                        onChange={phoneSelectChangeHandler}
                    >
                        <option value="mobile">Mobile</option>
                        <option value="work">Work</option>
                        <option value="home">Home</option>
                        <option value="car">Car</option>
                    </select>
                    <input
                        id={phoneKey}
                        type="text"
                        placeholder="Phone"
                        value={currentUser.phones[phoneKey].number}
                        onInput={phoneInputHandler}
                        required={true}
                    />
                </div>
            </div>
        );
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
                    ref={removeIco}
                />
                <div className="user-data_row">
                    <label htmlFor="first_name">First Name:*</label>
                    <input
                        id="first_name"
                        type="text"
                        placeholder="First Name"
                        required={true}
                        value={currentUser ? currentUser.first_name : ''}
                        data-id={currentUser ? currentUser.id : null}
                        onInput={nameChangeHandler}
                    />
                </div>
                <div className="user-data_row">
                    <label htmlFor="last_name">Last Name:*</label>
                    <input
                        id="last_name"
                        type="text"
                        placeholder="Last Name"
                        required={true}
                        value={currentUser ? currentUser.last_name : ''}
                        data-id={currentUser ? currentUser.id : null}
                        onInput={nameChangeHandler}
                    />
                </div>
                <>
                    {currentUser &&
                        Object.values(currentUser.phones).length &&
                        Object.keys(currentUser.phones).map((key) =>
                            getPhoneRow(key)
                        )}
                </>
            </div>
            <div className="buttons-wrapper">
                <input
                    type="button"
                    value="Cancel"
                    className="cancelBtn"
                    onClick={cancelBtnHandler}
                />
                <input
                    type="button"
                    value="Save"
                    className="saveBtn"
                    onClick={saveBtnHandler}
                />
            </div>
        </div>
    );
};
