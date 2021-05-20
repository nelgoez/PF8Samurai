import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import supabase from '../../../supabase.config';
import './UserProfile.css';
import { Autocomplete } from '@material-ui/lab';
import { Button, TextField } from '@material-ui/core';

// Estilos usados en componentes de MUI.
const useStyles = makeStyles({
  root: { //className={classes.root}
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  modButton: {
    height: 40,
    backgroundColor: '#41aea9',
    color: '#000000',
    fontWeight: 600,
    alignSelf: "flex-end",
    marginRight: 30,
  },
  modInput: {
    marginBottom: 15,
    width: "100%",
    background: "white"
  },
  selInput: {
    marginBottom: 15,
    width: "100%",
    background: "white"
  },
  autoInput: {
    width: "100%",
    marginBottom: 15,
    background: "white"
  }

});

export default function UserProfile() {

  // Estilos para MUI.
  let classes = useStyles();

  // Estado que guarda localmente los datos del perfil del usuario.
  let [user, setUser] = useState(null);

  // Función que a partir del número de documento (que obtiene
  // del localStorage), se trae la información del usuario 
  // de la base de datos.
  let fetchUserData = async (document) => {
    let { data: userInfo, error: errorFetchUser } = await supabase
      .from('partners')
      .select(
        'dni, name, lastname, birthdate, phone_number, email,  plans (id, name),gender, address (locality_id,street, street_number, floor, department, localities (name, postal_code, states (id,name)))')
      .eq('dni', document);
      // console.log(userInfo);

    setUser({
      dni: userInfo[0].dni,
      plan: userInfo[0].plans.name,
      name: userInfo[0].name,
      lastname: userInfo[0].lastname,
      birthdate: userInfo[0].birthdate,
      email: userInfo[0].email,
      phone: userInfo[0].phone_number,
      street: userInfo[0].address[0].street,
      street_number: userInfo[0].address[0].street_number,
      floor: userInfo[0].address[0].floor,
      department: userInfo[0].address[0].department,
      locality_id: userInfo[0].address[0].locality_id,
      locality: userInfo[0].address[0].localities.name,
      state: userInfo[0].address[0].localities.states.name,
      state_id: userInfo[0].address[0].localities.states.id,
      postal_code: userInfo[0].address[0].localities.postal_code,
    });
    if (errorFetchUser) return console.log(errorFetchUser);
  };

  // Al cargar la página por primera vez, se trae del localStorage
  // el dni del usuario y carga en user los datos que se trae
  // de la base de datos.
  useEffect(() => {
    let userDni = JSON.parse(localStorage.getItem('userdata')).dni;
    fetchUserData(userDni);
  }, []);

  // Función que calcula la edad en base a la F.Nac.
  function getAge(date) {
    var today = new Date();
    var birthdate = new Date(date);
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }

  // Estado de modificación del perfil del usuario
  // (si modifica o deja como está)
  let [modify, setModify] = useState(false);

  // Función de cambio de estado de modificación
  // al hacer click en modificar.
  function handleclick(e) {  //submit
    // Cuando hace click en modificar ...
    if (!modify) {
      setModify(true);
    }
  }

  //----------------------------------------------------
  function handlesubmit() {
    // Guardar datos en supabase !!!!!

    if (validate()) {

      //Update partners table (si modifico email o teléfono)
      let modifyPartnersT = async (user, modInfo) => {
        let { data, error } = await supabase
          .from('partners')
          .update({
            phone_number: modInfo.phone_number,
            email: modInfo.email
          })
          .eq('dni', user.dni)
      }

      //Update address table (si modifico dirección o localidad)
      let modifyAddressT = async (user, modInfo) => {
        let { data, error } = await supabase
          .from('address')
          .update({
            street: modInfo.street,
            street_number: modInfo.street_number,
            floor: modInfo.floor,
            department: modInfo.department,
            locality_id: modInfo.locality_id, // <---OJO Cómo lo hago!!!!
          })
          .eq('partner_dni', user.dni)
      }

      alert('Guardó')
      setModify(false)
      // limpia inputs de datos a modificar
      // setModInfo({
      //   address: '',
      //   phone: '',
      //   email: '',
      //   state: '',
      //   locality: '',
      //   postal_code: ''
      // })
    }
  }
  //----------------------------------------------------

  // Provincias a mostrar en el selector.
  let [allstates, setAllstates] = useState(null);

  // Función que obtiene las provincias de la base de datos,
  // y las guarda como un arreglo en el estado allstates. 
  async function getStates() {
    try {
      let { data: states } = await supabase
        .from("states")
        .select("name");

      setAllstates(states.map(e => e.name));
    } catch (err) {
      console.error(err);
    }
    return;
  }

  // Cuando hace click en modificar se trae las provincias.
  // y las guarda en el estado allstates.
  useEffect(() => {
    if (modify) {
      getStates();
    }
  }, [modify]);

  // Renderiza el selector de provincias cuando se carga allstates.
  useEffect(() => {
  }, [allstates]);

  // Estado local donde guarda los datos modificables del perfil del usuario.
  let [modInfo, setModInfo] = useState(null);

  // Cuando hago click en modificar, guarda por primera en el
  //  estado modInfo todos los datos que ya tenía del usuario.
  useEffect(() => { //modInfo.street.length
    if (modify && !!user.name.length) {
      // console.log(user);

      // setea los datos que puede modificar
      setModInfo({
        email: user.email,
        phone: user.phone,
        street: user.street,
        street_number: user.street_number,
        floor: user.floor,
        department: user.department,
        locality_id: user.locality_id,
        locality: user.locality,
        state: user.state,
        state_id: user.state_id,
        postal_code: user.postal_code,
        })
      console.log('cargué modInfo');
    }
  }, [user, modify]);

  // let [textInputs, setTextInputs] = useState({})
  // Estado de errores por cada input modificable.
  let [error, setError] = useState({
    street: '',
    street_number: '',
    floor: '',
    department: '',
    email: '',
    phone: '',
    // state: '', <-- No tiene error x q viene del selector
    locality: '',
    postal_code: ''
    // locality_id: 
  })

  // Cuando cambio un dato del usuario setea el error y modifica 
  // el estado (modInfo) en donde se guarda .
  let handlechange = (e) => { // ver que el input tenga los mismos nombres
	  let item = e.target.name;
    switch (item) {
		  case 'street': // Que no esté vacío ni espacios
      // ^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$
        let streetreg = /[0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+[ ]?[0-9a-z A-ZÀ-ÿ\u00f1\u00d1]*$/; 

        setError(error => (
          {...error, [e.target.name]: (streetreg).test(e.target.value) ? '' : 'No puede quedar incompleto o en blanco.' }
        ));
		    setModInfo({...modInfo, [e.target.name]: e.target.value });
		    break;
		  case 'street_number':
        // let snumregex = /^[0-9]{1,10}$/;
        let snumregex = /^\d{1,10}$/;
        setError(error => (
      		{...error, [e.target.name]: snumregex.test(e.target.value) ? '' : 'Sólo admite números' }
		    ));
		    setModInfo({...modInfo, [e.target.name]: e.target.value });
		    break;
		  case 'floor':
		    setModInfo({...modInfo, [e.target.name]: e.target.value });
		    break;
		  case 'department': 
		    setModInfo({...modInfo, [e.target.name]: e.target.value });
		    break;
		  case 'email':
        let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

		  	setError(error => (
      		{...error, [e.target.name]: emailRegex.test(e.target.value) ? '' : 'Debe ser un email válido' }
		    ));
		    setModInfo({...modInfo, [e.target.name]: e.target.value });
		    break;
		  case 'phone':
		  	setError(error => (
      		{...error, [e.target.name]: (/^[0-9]{5,9}$/).test(e.target.value) ? '' : 'De 5 (fijo) a 9 (cel sin 15 ni cod. área) cifras.' }
		    ));
		    setModInfo({...modInfo, [e.target.name]: e.target.value });
		    break;
		  case 'state':
        // Si cambio la provincia tengo que sacar el código postal 
        // id de provincia y la localidad que estaba por defecto.
		    setModInfo({
          ...modInfo,
          [e.target.name]: e.target.value ,
          locality_id: '',
          locality: '',
          state_id: '',
          postal_code: '',
        });
		    break;
		  case 'postal_code':
		  	setError(error => (
      		{...error, [e.target.name]: (/^[0-9]{4}$/).test(e.target.value) ? '' : 'Debe ser un número de 4 cifras' }
		    ));
		    setModInfo({...modInfo, [e.target.name]: e.target.value });
		    break;    
     default:
        break;
        }
    };
  
  // Cuando cambio una localidad setea el error y modifica 
  // el estado (modInfo) en donde se guarda .
  let handlechange2 = (e, value) => {
    console.log('seleccionaste', value);

    getInfoLocality(value);


    // Que no sea string vacío
    let cityregex = /[\S]/ ;

    setError(error => (
    	{...error, [e.target.name]: (cityregex).test(e.target.value) ? '' : 'No puede quedar incompleto.' }
    ));

    async function getInfoLocality(city) {
      try {
        let { data: infolocality } = await supabase
          .from("localities")
          .select("id_locality,name,postal_code,state_id")
          .eq('name', city)
          .eq('name', city);

        console.log(infolocality);
        // set
  
        // setAllstates(states.map(e => e.name));
      } catch (err) {
        console.error(err);
      }
      return;
    }
    
    //      state_id: value.state_id,

    setModInfo({
      ...modInfo, 
      locality_id: value.id, 
      locality: value, 
      postal_code: value.postal_code
      })
    // agregar locality
    // ver showcities
  }

  let validate = (modInfo) => {
    return Object.values(error).every(x => x === "");
    //si no tiene ningún mensaje de error devuelve true
  }

  // Cada vez que se modifica modInfo renderiza.
  useEffect(() => {
    if (modInfo) {
    }
  }, [modInfo, error]);


  // Ciudades a cargar en el selector.
  let [showCities, setShowCities] = useState(null);

  // let [filtro, setFiltro] = useState(null);

  // Función que filtra las ciudades según la provincia ingresada
  // y el filtro de búsqueda.
  // async function getCity(provincia, filtro) {
  async function getCity(provincia) {
    try {
      // busca id de la provincia
      let { data: state } = await supabase
        .from("states")
        .select("id,name")
        .eq('name', provincia)
      let sid = state[0].id;

      console.log(sid)

      try {
        // guarda en cities las ciudades de esa provincia
        let { data: cities } = await supabase
          .from('localities')
          .select(`id, name, postal_code,states(id,name)`)
          .eq('state_id', sid)

        console.log(cities);
        console.log(cities[0]);
        let namecities = cities.map(e => e.name)
        // guarda en showCities las ciudades a mostrar en el selector

        setShowCities(namecities);
        //return??

      } catch (err2) {
        console.log(err2);
      }

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(async () => {
    // let filtro = 'Villa';
    // await getCity('Cordoba', filtro)
    await getCity('Cordoba')
    console.log('toy acá')
  }, [])

  useEffect(() => {
    if (showCities) {
      console.log('show', showCities)
    }
  }, [showCities])

  let handleback = (e) => {
    //botón para volver a la página anterior o salir
  }

  return (
    <div className="ProfilePage_Cont">
      {user && <div className="info_cont">
        {!modify ?
          // Si no modifica usa los datos de user.
          <div className="input_info">
            <h1 className="title">Mi Perfil</h1>
            <div className="on_line_cont">
              <div className="one_info_cont">
                <p className="profile_title">Plan:</p>
                <p className="profile_info">{user.plan}</p>
              </div>
            </div>
            <div className="on_line_cont">
              <div className="one_info_cont">
                <p className="profile_title">Nombre:</p>
                <p className="profile_info">{user.name}</p>
              </div>
              <div className="one_info_cont">
                <p className="profile_title">Apellido:</p>
                <p className="profile_info">{user.lastname}</p>
              </div>
              <div className="one_info_cont">
                <p className="profile_title">Edad:</p>
                <p className="profile_info">{getAge(user.birthdate)}</p>
              </div>
            </div>
            <div className="on_line_cont">
              <div className="one_info_cont">
                <p className="profile_title">F. Nacimiento:</p>
                <p className="profile_info">{user.birthdate}</p>
              </div>
            </div>
            <div className="on_line_cont">
              <div className="one_info_cont">
                <p className="profile_title">email:</p>
                <p className="profile_info">{user.email}</p>
              </div>
              <div className="one_info_cont">
                <p className="profile_title">Teléfono:</p>
                <p className="profile_info">{user.phone}</p>
              </div>
            </div>
            <div className="on_line_cont">
              <div className="one_info_cont">
                <p className="profile_title">Calle:</p>
                <p className="profile_info"> {user.street}</p>
              </div>
              <div className="one_info_cont">
                <p className="profile_title">Número:</p>
                <p className="profile_info"> {user.street_number}</p>
              </div>
              <div className="one_info_cont">
                <p className="profile_title">Piso:</p>
                <p className="profile_info"> {user.floor}</p>
              </div>
              <div className="one_info_cont">
                <p className="profile_title">Dto:</p>
                <p className="profile_info"> {user.department}</p>
              </div>

            </div>
            <div className="on_line_cont">
              <div className="one_info_cont">
                <p className="profile_title">Ciudad:</p>
                <p className="profile_info">{user.locality}</p>
              </div>
              <div className="one_info_cont">
                <p className="profile_title">Código Postal:</p>
                <p className="profile_info">{user.postal_code}</p>
              </div>
            </div>
            <div className="on_line_cont">
              <div className="one_info_cont">
                <p className="profile_title">Provincia:</p>
                <p className="profile_info">{user.state}</p>
              </div>
            </div>
          </div>
          :
          // Si modifica usa los datos de modInfo.
          <>
            {modInfo && <div className="modif_info">
              <form className="mod_form_cont" noValidate autoComplete="off">

                <div className="form_left_col">
                  <TextField
                    name="street"
                    id="streetInput"
                    className={classes.modInput}
                    label="Calle"
                    variant="outlined"
                    defaultValue={modInfo.street}
                    onChange={handlechange}
                    error={error.street}
                    helperText={error.street}
                  />
                  <TextField
                    name="street_number"
                    id="street_numberInput"
                    className={classes.modInput}
                    label="Número"
                    variant="outlined"
                    defaultValue={modInfo.street_number}
                    onChange={handlechange}
                    error={error.street_number}
                    helperText={error.street_number}
                  />
                  <TextField
                    name="floor"
                    id="floorInput"
                    className={classes.modInput}
                    label="Piso"
                    variant="outlined"
                    defaultValue={modInfo.floor}
                    onChange={handlechange}
                  />
                  <TextField
                    name="department"
                    id="departmentInput"
                    className={classes.modInput}
                    label="Departamento"
                    variant="outlined"
                    defaultValue={modInfo.department}
                    onChange={handlechange}
                  />
                  <TextField
                    name="email"
                    id="emailInput"
                    className={classes.modInput}
                    label="email"
                    variant="outlined"
                    defaultValue={modInfo.email}
                    onChange={handlechange}
                    error={error.email}
                    helperText={error.email}
                  />
                </div>

                <div className="form_right_col">
                  <TextField
                    name="phone"
                    id="phoneInput"
                    className={classes.modInput}
                    defaultValue={modInfo.phone}
                    label="Teléfono"
                    variant="outlined"
                    onChange={handlechange}
                    error={error.phone}
                    helperText={error.phone}
                  />

                  <TextField
                    id="stateInput"
                    select
                    label="Provincia"
                    value={modInfo.state}
                    onChange={handlechange}
                    // helperText="Seleccione una provincia"
                    variant="outlined"
                    name="state"
                    className={classes.selInput}
                  >
                    {allstates && allstates.map((state, index) => (
                      <option
                        className="inputSel"
                        key={index}
                        value={state}
                      >{state}</option>
                    ))}
                  </TextField>

                  {/* cities */}
                  <Autocomplete
                    id="cityInput"
                    name="locality"
                    //  Acá va el arreglo a mostrar en el selector
                    options={showCities}
                    autoHighlight
                    label="Localidad"
                    value={modInfo.locality}
                    variant="outlined"
                    onChange={handlechange2}
                    className={classes.autoInput}
                    getOptionLabel={(option) => option}
                    error={error.locality}
                    helperText={error.locality}
                    // getOptionLabel={(option) => console.log(option.name)}
                    renderOption={(option) => option}
                    // {id:, name:,postal_code:}
                    // {showCities && showCities.map((locality, index) => (
                    //   <option
                    //     className="inputSel"
                    //     key={index}
                    //     value={locality}
                    //   >{locality}</option>
                    // ))}
                    renderInput={(params) => (
                      <TextField
                        id="cityInputopt"
                        name="cityOpt"
                        {...params}
                        label="Localidad"
                        variant="outlined"
                        // placeholder="Favorites"

                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />

                  <TextField
                    name="postal_code"
                    className={classes.modInput}
                    label="Código Postal"
                    variant="outlined"
                    defaultValue={modInfo.postal_code}
                    value={modInfo.postal_code}
                    onChange={handlechange}
                    error={error.postal_code}
                    helperText={error.postal_code}
                  />

                  {/* {modify && <Button
                  id="backbtn"
                  variant="contained"
                  className={classes.modButton}
                  onClick={handleback}
                >
                  Volver
                </Button>} 
                O VOLVER ????
                */}
                  <Button
                    id="savebtn"
                    variant="contained"
                    className={classes.modButton}
                    onClick={handlesubmit}
                  >
                    Guardar
                </Button>

                </div>
              </form>

            </div>}
          </>
        }
        {!modify && <Button
          id="modbtn"
          variant="contained"
          className={classes.modButton}
          onClick={handleclick}
        >
          Modificar
        </Button>}

      </div>
      }
    </div >
  );
}


