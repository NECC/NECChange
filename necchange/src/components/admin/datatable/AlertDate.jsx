import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

export default function AlertDate(props) {
  const { data, setdata } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const delete_data = async (id) => {
    setOpen(false);
  
    try {
      await axios.delete(`/api/calendar/getCalendar/?id=${id}`);
  
      setdata((prev) => {
        const updated = { ...prev };
  
        for (const ano in updated) {
          updated[ano] = updated[ano].filter((item) => item.id !== id);
        }
  
        return updated;
      });
  
    } catch (err) {
      console.error("Erro ao apagar evento:", err);
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Eliminar evento?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Pertende eliminar o evento <strong>{data.title}</strong> com a data{" "}
            <strong>{data.start}</strong>? Esta ação é irreversível.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => delete_data(data.id)}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
