import '../styles/searchTrack.css'

function SearchTrack({song, setter}) {
  const songName = song.name
  const artistName = song.artist
  const coverArt = song.image
  // TODO Implement dynamic song/genre/artist Get info from api and pass in props
  // TODO Calculate minutes left with minutes left before previous song + length of song before

  const handleClick = () => {
    // console.log(song)
    setter(song)
  }

  return (
    <>
      <div 
      className='searchtrack-container clickable' 
      onClick={handleClick}>
        <div className="artist-cover-search">
          <img className='cover-search' src={coverArt} alt="Cover" width='75' height='75' />
        </div>
        <div className="central-info-search">
          {
            songName.split('').length<50?
            <span className="song-list">{songName}</span>
            :
            <span className="song-list">{songName.slice(0,50) + '[...]'}</span>
          }
          {/* <span className="genres-list">{genreList.slice(0,2).join('-')}</span> */}
          <span className="artist-list">{artistName}</span>
        </div>
        <div className="minutes-left-list">
      </div>
      </div>
    </>
  );
};

export default SearchTrack;