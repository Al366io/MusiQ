import '../styles/addbutton.css'

const AddButton = () => {
  // when clicking the + button, we should open a modal panel that let the adder search for a song 
  // and then insert it. when doing so, send a request to backend with the party id 
  // backend retrieve the acess_token associated wih the party id and send to request to spotify 
  // then send the data back to frontend  
  return (
    <div>
    <button onClick={(() => alert('Spotify Handler'))} id="adding-song-button">
      +
    </button>
    {/* here im gonna mess with it to implement a fast search and add to queue, just to consume the api */}
    
    </div>
  );
};

export default AddButton;