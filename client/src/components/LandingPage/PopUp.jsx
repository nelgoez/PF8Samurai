import React, { useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';


const PopUp = (props) => {

  const descriptionElementRef = useRef(null);
   const { Img, Title, Description, Summary } = props.news;
   const { closePopup } = props;
   const { show } = props;


   useEffect(() => {
    if (show) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [show]);

    return (
      <Dialog
        open={show}
        onClose={closePopup}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{Title}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <img src ={Img} alt='News img'/>
            <br/>
            <Typography variant='subtitle1'>
              {Summary}
            </Typography>
            <br/>
            <Typography paragraph variant='body2'>  
            {Description}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }


  export default PopUp;