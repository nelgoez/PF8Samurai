import React, { useState, useEffect } from 'react';
// import { useLocation } from "react-router-dom";
import {
    Button,
    List,
    ListItem,
    Divider,
    Card,
    Avatar,
    TextField,
    Typography
} from '@material-ui/core';
import 'firebase/auth';
import { makeStyles } from '@material-ui/core/styles';
import supabase from '../../../supabase.config.js';
import { useUser } from 'reactfire';
import style from './Consult.module.css';
// import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme)=>({
    dividerFullWidth: {
        margin: `5px 0 0 ${theme.spacing(9)}px`,
    },
    card: {
        maxWidth: '90%',
    },
    textField: {
        width: '90%',
    },
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

function Consult({ firebase }) {
    const [patient,setPatient] = useState({});
    const [medic,setMedic] = useState(JSON.parse(localStorage.getItem('medicdata')));
    const [redirectNewOrder, setRedirectNewOrder] = useState(false);
    const [redirectNewPrescription, setRedirectNewPrescription] = useState(false);
    
    const classes = useStyles();
    const userFirebase = useUser();
    
    const [input,setInput] = useState({
        reason:'',
        diagnosis:'',
        observations:''
    })
    const [errors, setErrors] = useState({
        reason:false,
        diagnosis:false,
        observations:false
    });

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const patientData = {
        dni: params.get('dni'),
        name: params.get('name'),
        lastname: params.get('lastname'),
        birthdate: params.get('birthdate'),
        gender: params.get('gender'),

    }
    
    useEffect(()=>{
        setPatient(patientData)
        console.log(patient)
        console.log(medic)
    },[])


    
    // if (!userFirebase.data) {
    //     window.location = '/login';
    // }

    const getAge = () => Math.floor((new Date() - new Date(patient.birthdate).getTime()) / 3.15576e+10)
    var today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    const handleSubmit = async() => {
        if( !errors.reason&&
            !errors.diagnosis&&
            !errors.observations){
                const { data, error } = await supabase
                .from('medical_consultations')
                .insert([
                    {   
                        partner_dni: patient.dni,
                        medic_dni: medic.dni,
                        reason: input.reason,
                        diagnosis: input.diagnosis,
                        date: date,
                        observations: input.observations,
                    },
                ])
            }
    }

    const handleBtnNewPrescription = () => {
        setRedirectNewPrescription(true);
    };
    const handleBtnNewOrder = () => {
        setRedirectNewOrder(true);
    };

    const handleInputChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
        setErrors(validate(e.target.name, e.target.value));
    };

    function validate(inputName, value) {
        const pattern = /^[A-Za-z0-9\s]+$/g;
        let errors = {};

        switch (inputName) {
            case 'reason': {
                if (!pattern.test(value) && value.length>0) {
                    errors.reason = true;
                } else {
                    errors.reason = false;
                }
                break;
            }
            case 'diagnosis': {
                if (!pattern.test(value) && value.length>0) {
                    errors.diagnosis = true;
                } else {
                    errors.diagnosis = false;
                }
                break;
            }
            case 'observations': {
                if (!pattern.test(value)) {
                    errors.observations = true;
                } else {
                    errors.observations = false;
                }
                break;
            }
            default:
                return null;
        }
        return errors;
    }
    
    return (
        <Card className={classes.card}>
            <List>
                <div className={style.medicData}>
                    <div className={style.medicFirstColumn}>
                        <div>
                            <ListItem>
                                <Avatar alt={medic.name} src={medic.profilePic} className={classes.largeAvatar} />   
                            </ListItem>
                        </div>
                        <div>
                            <ListItem>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {medic.name} {medic.lastname}
                                </Typography>
                            </ListItem>
                        </div>
                    </div>
                    <div className={style.medicSecondColumn}>
                        <div>
                            <ListItem>
                                <Typography gutterBottom variant="subtitle1" component="h2">
                                    {medic.medic_license}
                                </Typography>
                            </ListItem>
                        </div>
                        <div>
                            <ListItem>
                                <Typography gutterBottom variant="subtitle1" component="h2">
                                    {medic.medical_specialities[0].name}
                                </Typography>
                            </ListItem>
                        </div>  
                    </div>
                </div>
                <Divider component="li" />
                <div className={style.patientData}>
                    <div className={style.patientFirstColumn}>
                        <div>
                            <ListItem>
                                <Typography gutterBottom variant="h6" component="h2">
                                    Paciente: 
                                </Typography>
                            </ListItem>
                        </div>
                        <div>
                            <ListItem>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {patient.name} {patient.lastname}
                                </Typography>
                            </ListItem>
                        </div>
                    </div>
                    <div className={style.patientSecondColumn}>
                        <div>
                            <ListItem>
                                <Typography gutterBottom variant="subtitle1" component="h2">
                                    DNI: {patient.dni}
                                </Typography>
                            </ListItem>
                        </div>
                        <div>
                            <ListItem>
                                <Typography gutterBottom variant="subtitle1" component="h2">
                                    Edad: {getAge()}
                                </Typography>
                            </ListItem>
                        </div>
                        <div>
                            <ListItem>
                                <Typography gutterBottom variant="subtitle1" component="h2">
                                    Sexo: {patient.gender}
                                </Typography>
                            </ListItem>
                        </div>
                    </div>
                </div>
                <Divider component="li" />
                <div className={style.form}>
                    <div className={style.input}>
                        <TextField
                            id="reason-input"
                            name='reason'
                            label="Razón de consulta"
                            variant='outlined'
                            multiline
                            rows={6}
                            className={classes.textField}
                            onChange={handleInputChange}
                            {...(errors.reason && {
                                error: true,
                                helperText: 'Solo se permiten letras y numeros',
                            })}
                        />
                    </div>
                    <div className={style.input}>
                        <TextField
                            id="diagnosis-input"
                            name='diagnosis'
                            label="Diagnóstico"
                            variant='outlined'
                            multiline
                            rows={6}
                            className={classes.textField}
                            onChange={handleInputChange}
                            {...(errors.diagnosis && {
                                error: true,
                                helperText: 'Solo se permiten letras y numeros',
                            })}
                        />
                    </div>
                    <div className={style.input}>
                        <TextField
                            id="ovservations-input"
                            name='observations'
                            label="Observaciones"
                            variant='outlined'
                            multiline
                            rows={6}
                            className={classes.textField}
                            onChange={handleInputChange}
                            {...(errors.observations && {
                                error: true,
                                helperText: 'Solo se permiten letras y numeros',
                            })}
                        />
                    </div>
                </div>
                <Divider component="li" />
                <div className={style.buttons}>
                    <div className={style.btn}>
                        <Button variant="outlined" size="large" color="primary">
                            Nueva receta
                        </Button>
                    </div>
                    <div className={style.btn}>
                        <Button variant="outlined" size="large" color="primary">
                            Nueva orden
                        </Button>
                    </div>
                    <div className={style.btn}>
                        <Button variant="contained" size="large" color="primary">
                            Subir consulta
                        </Button>
                    </div>
                </div>
            </List>
        </Card>
    );
}

export default Consult;