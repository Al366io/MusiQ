import "../styles/addbutton.css";
import { useState } from "react";
import { getQueryResult } from "../../ApiServices";

const AddButton = ({id, setter}) => {
  // when clicking the + button, we should open a modal panel that let the adder search for a song
  // and then insert it. when doing so, send a request to backend with the party id
  // backend retrieve the acess_token associated wih the party id and send to request to spotify
  // then send the data back to frontend

  const [query, setQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState([]);

  let searchTimeout

  const queryHelper = async (input) => {

    clearTimeout(searchTimeout)
    if (!input) return setSearchResponse([])

    searchTimeout = setTimeout(() => {
      setQuery(input)
      getQueryResult(id, query).then(res => setSearchResponse(res))
    }, 750)

  }

  async function handleSubmit(e) {
    e.preventDefault();
    setter(searchResponse[0])
  }


  return (
    <div>
      <form id="search-bar-container" action="" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Song Name"
              id="search-bar-input"
              onChange={(e) => {
                queryHelper(e.target.value)
              }}
            />
            <input id="adding-song-button" type="submit" value="+"/>
          </form>
          <div id='search-results'>
              {searchResponse.map((song) => {
                <div id="search-result-item">
                  <img className='cover-track' src={song.image} alt="Cover" width='25' height='25' />
                  <span>{song.name}</span>
                  <span>{song.artist}</span>
                </div>
              })}
          </div>
    </div>
  );
};

export default AddButton;
