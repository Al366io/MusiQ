import "../styles/addbutton.css";
import { useState } from "react";
import Track from "./Track";
import { getQueryResult, addSongToQueue } from "../../ApiServices";

const AddButton = ({id, setter}) => {
  // when clicking the + button, we should open a modal panel that let the adder search for a song
  // and then insert it. when doing so, send a request to backend with the party id
  // backend retrieve the acess_token associated wih the party id and send to request to spotify
  // then send the data back to frontend

  const [searchFocus, setsearchFocus] = useState(false)
  const [searchResponse, setSearchResponse] = useState([]);

  let searchTimeout

  const queryHelper = async (input) => {

    clearTimeout(searchTimeout)

    if (!input) return setSearchResponse([])

    searchTimeout = setTimeout(() => {
      getQueryResult(id, input).then(res => setSearchResponse(res))
    }, 750)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setter(searchResponse[0])
  }

  return (
    <>
    <div id="add-button">
      <form id="search-bar-container" 
      onSubmit={handleSubmit}
      onFocus={() => setsearchFocus(true)}
      >
            <input
              type="text"
              placeholder="Add Song to Queue"
              id="search-bar-input"
              onInput={(e) => {
                queryHelper(e.target.value)
              }}
            />
            <input id="adding-song-button" type="submit" value="+"/>
          </form>
        </div>
        {searchFocus 
        ?
          <div id="modal-back" style={{'zIndex' : `50`}} onClick={() => setsearchFocus(false)}>
            <div id="search-results">
            {searchResponse.map((song) => 
              song !== searchResponse[searchResponse.length-1] 
              ?
              <Track key={song.id} song={song} search={true} setter = {setter} />
              :
              <Track key={song.id} song={song} search={true} setter = {setter} last= {true} />
              )}
            </div>
          </div>

        :
      <div id="modal-back" style={{'zIndex' : `-1`}} onClick={() => setsearchFocus(false)} ></div>
        }
    </>

  );
};

export default AddButton;
