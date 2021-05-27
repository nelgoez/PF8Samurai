import React from "react";
import * as styles from "./DatosRevision.module.css";
import Pdf from "react-to-pdf";
import { Divider } from "@material-ui/core";
import Declaration from "./Declaration";
const ref = React.createRef();

const DatosRevision = () => {
  const datosTitular = JSON.parse(localStorage.getItem("datosTitular"));
  const datosEmpresa = JSON.parse(localStorage.getItem("datosEmpresa"));
  const datosDeclaration = JSON.parse(localStorage.getItem("datosDeclaration"));

  return (
    <div className={styles.form}>
      <div className={styles.title}>
        <h1>Revision de Datos </h1>
      </div>
      <div id="lacolumna" className={styles.ajuste}>
        <div className={styles.datos}>
          <div className={styles.datosTitular}>
            <div className={styles.firstColumn}>
              <h2>Datos del Titular</h2>
              <h4>Nombre: {datosTitular.first_name}</h4>
              <h4>Apellido: {datosTitular.last_name}</h4>
              <h4>Genero: {datosTitular.gender}</h4>
              <h4>DNI: {datosTitular.dni}</h4>
              <h4>CUIL: {datosTitular.cuil}</h4>
              <h4>Teléfono: {datosTitular.phone_number}</h4>
              <h4>Email: {datosTitular.email}</h4>
              <h4>Ocupación: {datosTitular.occupation}</h4>
              <h4>Estado civil: {datosTitular.marital_status}</h4>
              <h4>Fecha de nacimiento: {datosTitular.birth_date}</h4>
              <h4>Calle: {datosTitular.street_name}</h4>
              <h4>Numero: {datosTitular.number}</h4>
              <h4>Piso/Depto: {datosTitular.apartment}</h4>
              <h4>Provincia: {datosTitular.state.split("-")[1]}</h4>
              <h4>Localidad: {datosTitular.locality.split("-")[1]}</h4>
            </div>
            <Divider></Divider>
            <div className={styles.datosEmpresa}>
              <h2>Datos del Empresa</h2>

              <h4>Razón Social:{datosEmpresa.bussines_name}</h4>
              <h4>Grupo empresarial:{datosEmpresa.bussines_group}</h4>
              <h4>
                Nombre y apellido del Referente de RRHH:{datosEmpresa.rh_name}
              </h4>
              <h4>Teléfono:{datosEmpresa.company_phone}</h4>
              <h4>E-mail:{datosEmpresa.company_email}</h4>
            </div>
          </div>

          <div ref={ref} id="Declaration" className={styles.salud}>
          <h2>Declaracion Jurada de Salud</h2>
          <h3>{datosDeclaration.completeName}</h3>
          <h4>{datosDeclaration.dni}</h4>
            {datosDeclaration.diabetes === "Si" ? (
              <h4>Diabetes:{datosDeclaration.diabetesD}</h4>
            ) : null}
            {datosDeclaration.heart === "Si" ? (
              <h4>Condiciones Cardíacas {datosDeclaration.heartD}</h4>
            ) : null}
         
            {datosDeclaration.hernia === "Si" ? (
              <h4>Hernia {datosDeclaration.herniaD}</h4>
            ) : null}
      
            {datosDeclaration.allergies === "Si" ? (
              <h4>Alergias {datosDeclaration.allergiesD}</h4>
            ) : null}
           
            {datosDeclaration.seizures === "Si" ? (
              <h4>Convulsiones{datosDeclaration.seizuresD}</h4>
            ) : null}
           
            {datosDeclaration.asthma === "Si" ? (
              <h4>Asma{datosDeclaration.asthmaD}</h4>
            ) : null}
        
            {datosDeclaration.sinusitis === "Si" ? (
              <h4>Sinusitis, Adenoides, Otitis a repetición
              Si
              {datosDeclaration.sinusitisD}</h4>
            ) : null}
           
            {datosDeclaration.hypertension === "Si" ? (
              <h4>Hipertensión {datosDeclaration.hypertensionD}</h4>
            ) : null}
           
            {datosDeclaration.hypotension === "Si" ? (
              <h4>Hipotensión{datosDeclaration.hypotensionD}</h4>
            ) : null}
  
            {datosDeclaration.others === "Si" ? (
              <h4>{datosDeclaration.othersD}</h4>
            ) : null}
            <Divider></Divider>
         
            {datosDeclaration.surgeryProt === "Si" ? (
              <h4> Operaciones/Protesís
                {datosDeclaration.surgeryProtD}</h4>
            ) : null}
            <Divider></Divider>
            
            {datosDeclaration.hearing === "Si" ? (
              <h4> Dificultades Auditivas:{datosDeclaration.hearingD}</h4>
            ) : null}
           
            {datosDeclaration.visual === "Si" ? (
              <h4>Dificultades visuales{datosDeclaration.visualD}</h4>
            ) : null}
           
            {datosDeclaration.spine === "Si" ? (
              <h4>Desviación de Columna{datosDeclaration.spineD}</h4>
            ) : null}
            
            {datosDeclaration.fainting === "Si" ? (
              <h4> Desmayos:{datosDeclaration.faintingD}</h4>
            ) : null}
            <Divider></Divider>
      
            {datosDeclaration.psychological === "Si" ? (
              <h4>Tratamiento Psicologico{datosDeclaration.psychologicalD}</h4>
            ) : null}
            
            {datosDeclaration.psychiatric === "Si" ? (
              <h4>Tratamiento psiquiátrico{datosDeclaration.psychiatricD}</h4>
            ) : null}
            
            {datosDeclaration.medicines === "Si" ? (
              <h4> Toma los siguientes medicamentos: {datosDeclaration.medicinesD}</h4>
            ) : null}
          </div>
        </div>
      </div>

      <Pdf targetRef={ref} filename={`Partner-${datosDeclaration.dni}`}>
        {({ toPdf }) => <button onClick={toPdf}> probando ese pdf</button>}
      </Pdf>
    </div>
  );
};
export default DatosRevision;
