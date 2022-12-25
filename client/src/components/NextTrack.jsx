import './styles/NextTrack.css'

function NextTrack({
songName = 'Chocolate with Jesus',
genreList = ['Hardcore', 'Punk', 'Death Metal'],
artistName = 'Moses'}) {

  console.log(songName)

  // TODO Implement dynamic song/genre/artist/minutes
  const minutesLeft = 12

  return (
    <div className="track-container next">
      <div className="artist-cover-list">
        <img src="" alt="Cover" />
      </div>
      <div className="central-info-list">
        <span className="song-list">{songName}</span>
        <span className="genres-list">{genreList.join('-')}</span>
        <span className="artist-list">{artistName}</span>
      </div>
      <div className="minutes-left-list">
        <span className='minutes-left-num'>{minutesLeft}</span>
        { 
        minutesLeft > 1 ?
          <span className='minutes-left-min'>mins</span>
        :
          <span className='minutes-left-min'>min</span>
        }
      </div>
    </div>
  );
};

export default NextTrack;