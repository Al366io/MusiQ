import "../styles/addbutton.css";
import { useState, useEffect } from "react";
import { getQueryResult } from "../../ApiServices";

const AddButton = ({id}) => {
  // when clicking the + button, we should open a modal panel that let the adder search for a song
  // and then insert it. when doing so, send a request to backend with the party id
  // backend retrieve the acess_token associated wih the party id and send to request to spotify
  // then send the data back to frontend

  const [query, setQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState([]);

  useEffect(() => {
    console.log(query);
    async function search() {
      let res = await getQueryResult(id, query);
      setSearchResponse(res);
    }
    if (query) {
      search();
    }
  }, [query]);

  async function handleSubmit(e) {
    e.preventDefault();
    let res = await getQueryResult(id, query);
    setSearchResponse(res);
  }


  return (
    <div>
      <button onClick={() => alert("Spotify Handler")} id="adding-song-button">
        +
      </button>
      <form action="" id="owner-options" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="song name"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            ></input>
            <input type="submit" value="Search"></input>
            <div className="queryResults">
              {searchResponse.map((song) => {
                console.log(song)
              })}
            </div>
          </form>
    </div>
  );
};

export default AddButton;
