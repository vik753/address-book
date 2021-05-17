import validator from 'validator';
import { useHistory, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { StateContext } from '../../stateContext/stateContext';
import './editPage.scss';
import { v4 as uuid_v4 } from 'uuid';
import _ from 'lodash';

export const EditPage = () => {
    const { id } = useParams();
    let history = useHistory();
    const userDataEl = useRef(null);
    const removeIco = useRef(null);
    const removeIcoSvg = useRef(null);
    const removePath1 = useRef(null);
    const removePath2 = useRef(null);
    const { users, setUsers } = useContext(StateContext);
    const [currentUser, setCurrentUser] = useState(null);
    const [numPhones, setNumPhones] = useState(1);
    const [isNamesValid, setIsNamesValid] = useState({
        first_name: true,
        last_name: true,
    });
    const [isPhonesValid, setIsPhonesValid] = useState({});
    const [isAllDataValid, setIsAllDataValid] = useState(true);

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

    useEffect(() => {
        if (!currentUser) return;
        const phonesLength = Object.values(currentUser.phones).length;
        setNumPhones(phonesLength);
    }, [currentUser]);

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
        isDataValid();
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
        isDataValid();
        setCurrentUser((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };

    const removePhoneHandler = (e) => {
        e.preventDefault();
        if(numPhones <= 1) return;
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
            isPhonesValid[key] = validator.isMobilePhone(value.number.replaceAll('-', ''));
        });
        setIsPhonesValid(isPhonesValid);
        const isPhValid = _.every(isPhonesValid, Boolean);

        const isNamesValid = {
            first_name: validator.isLength(first_name, { min: 2, max: 24 }),
            last_name: validator.isLength(last_name, { min: 2, max: 24 }),
        };
        setIsNamesValid(isNamesValid);
        const isNamesVal = _.every(isNamesValid, Boolean);
        setIsAllDataValid(isPhValid && isNamesVal);
        return isPhValid && isNamesVal;
    };

    const saveBtnHandler = (e) => {
        e.preventDefault();

        const isValid = isDataValid();
        if (!isValid) {
            return;
        }

        if (users.find((user) => user.id === currentUser.id)) {
            setUsers((prevState) => {
                const newState = prevState.map((user) => {
                    if (user.id === currentUser.id) {
                        return currentUser;
                    }
                    return user;
                });
                window.localStorage.setItem('address_book', JSON.stringify(newState));
                return newState;
            });
        } else {
            setUsers((prevState) => {
                const newState = [...prevState, currentUser];
                window.localStorage.setItem('address_book', JSON.stringify(newState));
                return newState;
            });
        }

        history.push('/');
    };

    const getPhoneRow = (phoneKey) => {
        if (removeIco.current && removeIcoSvg.current) {
            removeIco.current.setAttribute('data-id', phoneKey);
            removeIcoSvg.current.setAttribute('data-id', phoneKey);
            removePath1.current.setAttribute('data-id', phoneKey);
            removePath2.current.setAttribute('data-id', phoneKey);
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
                        onChange={phoneInputHandler}
                        required={true}
                        className={isPhonesValid[phoneKey] ? '' : 'errorInput'}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="edit-wrapper">
            <h1>Edit Contact</h1>
            <div className="user-data" ref={userDataEl}>
                <div className="add-phone" title="Add new phone" onClick={addPhoneHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7eba8b">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                </div>
                <div
                    className="remove-phone"
                    title="Remove phone"
                    onClick={removePhoneHandler}
                    disabled={numPhones <= 1}
                    ref={removeIco}
                >
                    <svg
                        ref={removeIcoSvg}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="tomato"
                    >
                        <path ref={removePath1} d="M0 0h24v24H0V0z" fill="none" />
                        <path ref={removePath2} d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                    </svg>
                </div>
                <div className="user-data_row">
                    <label htmlFor="first_name">First Name:*</label>
                    <input
                        id="first_name"
                        type="text"
                        placeholder="First Name"
                        required={true}
                        value={currentUser ? currentUser.first_name : ''}
                        data-id={currentUser ? currentUser.id : null}
                        onChange={nameChangeHandler}
                        className={isNamesValid.first_name ? '' : 'errorInput'}
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
                        onChange={nameChangeHandler}
                        className={isNamesValid.last_name ? '' : 'errorInput'}
                    />
                </div>
                <>
                    {currentUser &&
                        Object.values(currentUser.phones).length &&
                        Object.keys(currentUser.phones).map((key) => getPhoneRow(key))}
                </>
            </div>
            {!isAllDataValid && (
                <p className="all-required">
                    *All fields are required! Phones must be in correct format.
                </p>
            )}
            <div className="buttons-wrapper">
                <input
                    type="button"
                    value="Cancel"
                    className="cancelBtn"
                    onClick={cancelBtnHandler}
                />
                <input type="button" value="Save" className="saveBtn" onClick={saveBtnHandler} />
            </div>
        </div>
    );
};
