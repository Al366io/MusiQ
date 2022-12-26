import '../styles/Track.css'

function Track({
  songName = 'Chocolate with Jesus and Everyone Else From Home',
  genreList = ['Hardcore', 'Punk', 'Death Metal'],
  artistName = 'Moses',
  coverArt = 'https://i.scdn.co/image/ab6761610000e5eb361cc22b5c6ebc155a058cc4'}) {

  // TODO Implement dynamic song/genre/artist Get info from api and pass in props
  // TODO Calculate minutes left with minutes left before previous song + length of song before
  const minutesLeft = 12

  return (
    <div className="track-container">
      <div className="artist-cover-list">
        <img className='cover-track' src={coverArt} alt="Cover" width='75' height='75' />
      </div>
      <div className="central-info-list">
        {
          songName.split('').length<45?
          <span className="song-list">{songName}</span>
          :
          <marquee className="song-list">{songName}</marquee>
        }
        <span className="genres-list">{genreList.slice(0,2).join('-')}</span>
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

export default Track;