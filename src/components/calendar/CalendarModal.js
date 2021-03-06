import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew, eventUpdated } from '../../actions/events';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
}
Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1,'hours');
const nowend = now.clone().add(1,'hours'); //moment().minutes(0).seconds(0).add(2,'hours');

const initEvent = {
    title:'',
    notes:'',
    start: now.toDate(),
    end  : nowend.toDate()
}

export const CalendarModal = () => {

    const {modalOpen} = useSelector(state => state.ui);
    const {activeEvent} = useSelector(state => state.calendar);

    const dispatch = useDispatch();

    const [dateStart,setDateStart] = useState(now.toDate());
    const [dateEnd,setDateEnd] = useState(nowend.toDate());
    const [titleValid, setTitleValid] = useState(true)

    const [formValues, setformValues] = useState(initEvent);

    const { notes, title ,start , end } = formValues;

    useEffect(() => {
        console.log(activeEvent);
        if(activeEvent){
            setformValues(activeEvent);
        }
    }, [activeEvent,setformValues])    

    const handleInputChange = ({target}) => {
        setformValues({
            ...formValues,
            [target.name]: target.value
        });
    }

    const closeModal = ()=>{
        //console.log('closing......');
        dispatch(uiCloseModal());
        setformValues(initEvent);
    }
    const handleStartDateChange = (e)=> {
        console.log(e);
        setDateStart(e);
        setformValues({
            ...formValues,
            start: e
        });
    }
    const handleEndDateChange = (e) => {
        console.log(e);
        setDateEnd(e);
        setformValues({
            ...formValues,
            end: e
        });
    }

    const handleSubmitForm = (e)=>{
        e.preventDefault();

        console.log(formValues);

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if(momentStart.isSameOrAfter(momentEnd)){
            //console.log('Fecha 2 debe ser mayor');
            Swal.fire('Error','La fecha fin debe de ser mayor a la fecha de inicio','error');
            return;
        }
        if(title.trim().length < 2){
            return setTitleValid(false);
        }

        //TODO realizar la grabacion
        if(activeEvent){
            dispatch(eventUpdated(formValues));
        }
        else{
            dispatch(eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user: {
                    _id: '123',
                    name: 'Marcelo Aguilar'
                }
            }));
        }

        setTitleValid(true);
        closeModal();
    }
    return (
        <Modal
            isOpen={modalOpen}
            //onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            //contentLabel="Example Modal"
            closeTimeoutMS = {200}
            className="modal"
            overlayClassName="modal-fondo"
        >
                <h1> Nuevo evento </h1>
                    <hr />
                    <form 
                        className="container"
                        onSubmit= { handleSubmitForm }
                    >

                        <div className="form-group">
                            <label>Fecha y hora inicio</label>
                            <DateTimePicker
                                onChange={handleStartDateChange}
                                value={dateStart}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha y hora fin</label>
                            <DateTimePicker
                                onChange={handleEndDateChange}
                                value={dateEnd}
                                className="form-control"
                            />
                        </div>

                        <hr />
                        <div className="form-group">
                            <label>Titulo y notas</label>
                            <input 
                                type="text" 
                                //className="form-control"
                                className={`form-control ${ !titleValid && 'is-invalid'}`}
                                placeholder="T??tulo del evento"
                                name="title"
                                autoComplete="off"
                                value={ title }
                                onChange= {handleInputChange} 
                            />
                            <small id="emailHelp" className="form-text text-muted">Una descripci??n corta</small>
                        </div>

                        <div className="form-group">
                            <textarea 
                                type="text" 
                                className="form-control"
                                placeholder="Notas"
                                rows="5"
                                name="notes"
                                value={ notes }
                                onChange= {handleInputChange} 
                            ></textarea>
                            <small id="emailHelp" className="form-text text-muted">Informaci??n adicional</small>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-outline-primary btn-block"
                        >
                            <i className="far fa-save"></i>
                            <span> Guardar</span>
                        </button>

                    </form>
        </Modal>
    )
}
