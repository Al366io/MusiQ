import "../styles/addbutton.css";
import { useState } from "react";
import SearchTrack from "./SearchTrack";
import { getQueryResult, addSongToQueue } from "../../ApiServices";

const AddButton = ({id, setter}) => {

  const [searchFocus, setsearchFocus] = useState(false)
  const [searchResponse, setSearchResponse] = useState([]);

  let searchTimeout

  const queryHelper = async (input) => {

    clearTimeout(searchTimeout)

    if (!input) return setSearchResponse([])

    searchTimeout = setTimeout(() => {
      getQueryResult(id, input).then(res => setSearchResponse(res))
    }, 600)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setter(searchResponse[0].id)
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
              placeholder="Type Song to Add"
              id={searchFocus ? 'search-focused' : ''}
              className="search-bar-input"
              onInput={(e) => {
                queryHelper(e.target.value)
              }}
            />
          </form>
        </div>
        {searchFocus 
        ?
          <div id="modal-back" style={{'zIndex' : `50`}} onClick={() => setsearchFocus(false)}>
            <div id="search-results">
            {searchResponse.map((song) => 
              <SearchTrack key={song.id} song={song} />
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
