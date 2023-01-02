import "../styles/addbutton.css";
import { useState, useEffect } from "react";

const AddButton = () => {
  // when clicking the + button, we should open a modal panel that let the adder search for a song
  // and then insert it. when doing so, send a request to backend with the party id
  // backend retrieve the acess_token associated wih the party id and send to request to spotify
  // then send the data back to frontend

  return (
    <div>
      <button onClick={() => alert("Spotify Handler")} id="adding-song-button">
        +
      </button>
    </div>
  );
};

export default AddButton;
