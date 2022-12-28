import '../styles/addbutton.css'

const AddButton = () => {
  // when clicking the + button, we should open a modal panel that let the adder search for a song 
  // and then insert it. when doing so, send a request to backend with the party id 
  //  
  return (
    <button onClick={(() => alert('Spotify Handler'))} id="adding-song-button">
      +
    </button>
  );
};

export default AddButton;