import '../styles/NextTrack.css'

function NextTrack({
songName = 'Chocolate with Jesus',
genreList = ['Hardcore', 'Punk', 'Death Metal'],
artistName = 'Purple Floyd',
coverArt = 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png'},
) {

  // TODO Implement dynamic song/genre/artist/minutes

  return (
    <div className="track-next">
      <div className="artist-cover-next">
        <img className='cover-next' src={coverArt} alt="Cover" />
      </div>
      <div className="central-info-list">
        <span className="song-list">{songName}</span>
        <span className="artist-list">{artistName}</span>
      </div>
    </div>
  );
};

export default NextTrack;