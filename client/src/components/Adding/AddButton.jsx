import '../styles/addbutton.css'

const AddButton = () => {
  return (
    <button onClick={(() => alert('Spotify Handler'))} id="adding-song-button">
      +
    </button>
  );
};

export default AddButton;