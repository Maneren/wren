import {
  faPlus,
  faUser,
  faThumbsUp,
  faLocationDot,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import data from './data.json';
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  useMapEvents,
  Marker
} from 'react-leaflet';
import { Iter } from '@maneren/utils';

const { iter } = Iter;

const Button = (props) => (
  <button
    {...props}
    className={
      'rounded border border-gray-300 mx-3 my-1 p-2 ' +
      'shadow-sm hover:shadow-md active:shadow-inner text-center ' +
      props.className
    }
  >
    {props.children}
  </button>
);

const Post = ({ title, body }) => (
  <div className='border border-gray-300 shadow-md rounded-xl w-100 my-2 overflow-hidden'>
    <div className='block font-bold text-lg text-white p-1 text-center w-full bg-blue-500'>
      {title}
    </div>
    <div className='p-5 py-3 whitespace-pre'>{body}</div>
  </div>
);

const Dashboard = ({ posts }) => {
  return (
    <div className='flex flex-col p-2 pt-2 justify-start items-stretch w-1/3'>
      {posts.map((post, i) => (
        <Post key={i} {...post} />
      ))}
    </div>
  );
};

const PostWithLike = ({ title, body, liked, onLike }) => (
  <div className='border border-gray-300 shadow-md rounded-xl w-100 my-2 overflow-hidden'>
    <div className='block font-bold text-lg text-white p-1 text-center w-full bg-blue-500'>
      {title}
    </div>
    <div className='px-5 py-3 whitespace-pre'>{body}</div>
    <div
      className={`px-5 pb-3 text-3xl text-right ${
        liked ? 'text-blue-400' : ''
      }`}
    >
      <span onClick={onLike}>
        <FontAwesomeIcon icon={faThumbsUp} />
      </span>
    </div>
  </div>
);

const Suggestions = ({ suggestions }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suggs, setSuggs] = useState(suggestions);

  const toggleLiked = (i) => {
    const newSugg = { ...suggs[i] };
    newSugg.liked = !newSugg.liked;
    const newSuggs = [...suggs];
    newSuggs[i] = newSugg;
    setSuggs(newSuggs);
  };

  const addSuggestion = (suggestion) => {
    setSuggs([...suggs, suggestion]);
  };

  return (
    <div className='flex flex-col p-2 justify-start items-stretch w-1/3'>
      {suggs.map((suggestion, i) => (
        <PostWithLike key={i} {...suggestion} onLike={() => toggleLiked(i)} />
      ))}

      {/* Overlay */}
      <div
        onClick={() => setDialogOpen(false)}
        className={`absolute top-[-100px] right-0 z-[2000] w-[33.33%]
          h-[1000px] rounded-xl transition-all bg-black opacity-60
          ${dialogOpen ? 'block' : 'hidden'}`}
      />

      {SuggestionDialog(dialogOpen, setDialogOpen, addSuggestion)}

      <button
        onClick={() => setDialogOpen(true)}
        className={`absolute bg-blue-500 text-white bottom-6 right-5 z-10 rounded-full text-2xl w-16 h-16 flex justify-center items-center  ${
          dialogOpen ? 'hidden' : 'block'
        }`}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

const Map = ({ markers, addIssue }) => {
  const [dialogPhase, setDialogPhase] = useState(0);
  const [location, setLocation] = useState(null);
  const [markerDetails, setMarkerDetails] = useState(null);

  function LocationMarker () {
    useMapEvents({
      click (e) {
        if (dialogPhase === 2) {
          console.log(e.latlng.toString());
          setLocation(e.latlng);
        }
      }
    });

    return location === null
      ? null
      : (
      <Marker position={location}>
        <Popup>Vybraná lokace</Popup>
      </Marker>
        );
  }

  return (
    <div className='realtive w-1/3 h-full overflow-hidden'>
      <button
        onClick={() => setDialogPhase(1)}
        className={`absolute bg-blue-500 text-white bottom-6 right-[calc(33.333%+1rem)] z-[1000] rounded-full text-2xl w-16 h-16 flex justify-center items-center  ${
          dialogPhase !== 0 ? 'hidden' : 'block'
        }`}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>

      {IssueDialog(
        dialogPhase,
        setDialogPhase,
        location,
        setLocation,
        addIssue
      )}

      {/* Overlay */}
      <div
        onClick={() => setDialogPhase(0)}
        className={`absolute top-[-100px] left-[calc(33.333%)] right-[calc(33.333%)] z-[2000]
          h-[1000px] rounded-xl transition-all bg-black opacity-60
          ${dialogPhase % 2 === 0 ? 'hidden' : 'block'}`}
      />

      {/* Overlay marker selector */}
      <button
        onClick={() => setDialogPhase(3)}
        className={`'z-[5000] absolute w-[30.33%] mx-[1.5%] px-6 py-2.5 bg-blue-600
          text-white font-medium text-m leading-tight uppercase rounded
          shadow-md hover:bg-blue-700 hover:shadow-lg
          focus:bg-blue-700 focus:shadow-lg focus:outline-none
          focus:ring-0 active:bg-blue-800 active:shadow-lg
          transition duration-150 ease-in-out bottom-[40px]
          ${dialogPhase !== 2 ? 'hidden' : 'block'}`}
      >
        Vybrat
      </button>

      {/* Details panel */}
      <div
        className={`absolute w-[33.33%] h-5/6 ${
          markerDetails ? 'translate-y-0' : 'translate-y-full'
        } z-[5000] bottom-0 bg-white rounded-t-xl transition
            px-6 overflow-y-auto overflow-x-hidden duration-300
            shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]`}
      >
        <span
          className='text-2xl absolute right-3 top-1'
          onClick={() => setMarkerDetails(null)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </span>
        {markerDetails && markerDetailsComponent(markerDetails)}
      </div>

      <MapContainer
        center={[49.7396239, 13.3874331]}
        zoom={13}
        className='h-full w-full'
      >
        <TileLayer
          attribution={
            'Maps &copy; <a href="https://www.thunderforest.com">Thunderforest</a>, ' +
            'Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          }
          url='https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=0a97e67fa1fa415b91a95fb8e4fca1d4'
        />

        {markers.map((marker, i) => {
          const { position, category, progress } = marker;
          return (
            <CircleMarker
              key={i}
              center={position}
              radius={10}
              color={data.colorMappings.category[category]}
              fillColor={data.colorMappings.progress[progress]}
              weight={5}
              fillOpacity={0.5}
              eventHandlers={{
                click: () => {
                  console.log('marker clicked');
                  setMarkerDetails(marker);
                }
              }}
            />
          );
        })}
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

const App = () => {
  const [selectedScreen, setSelectedScreen] = useState(0);
  const [profile, setProfile] = useState(true);

  const [newMarkers, setNewMarkers] = useState([]);

  const screens = ['Nástěnka', 'Mapa', 'Návrhy'];

  const markers = [...data.markers, ...newMarkers];

  return (
    <div className='bg-gray-100 pt-14 h-screen container select-none'>
      <div className='fixed top-0 h-14 bg-blue-500 w-full flex items-center justify-center'>
        <span className='text-center text-3xl font-medium text-gray-200'>
          Wrepo
        </span>

        <button
          className={
            'absolute right-0 w-10 h-10 rounded-full ' +
            'bg-gray-200 flex justify-center items-center ' +
            'mx-2 pl-[0.5px] pb-[1px] z-50'
          }
          onClick={() => setProfile(!profile)}
        >
          <FontAwesomeIcon className='text-xl text-blue-500' icon={faUser} />
        </button>
      </div>
      <div className='h-[calc(100vh-6.5rem)] overflow-x-hidden overflow-y-clip'>
        <div
          className='w-[300%] h-full flex justify-start transition'
          style={{
            transform: `translateX(-${(selectedScreen * 100) / 3}%)`
          }}
        >
          <Dashboard posts={data.posts} />
          <Map
            markers={markers}
            addIssue={(issue) => setNewMarkers([...newMarkers, issue])}
          />
          <Suggestions suggestions={data.suggestions} />
        </div>
      </div>
      <div
        className={
          'fixed bottom-0 w-full h-12 border-t border-gray-300 ' +
          'flex items-center justify-center bg-gray-100 z-10 ' +
          'shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]'
        }
      >
        {screens.map((screen, i) => (
          <div
            key={i}
            className={
              'text-center flex-1 border-gray-800 ' +
              'flex items-center justify-center'
            }
            onClick={() => setSelectedScreen(i)}
          >
            <Button className='p-2 rounded-full border-0 shadow-none hover:shadow-none'>
              {screen}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

const IssueDialog = (
  dialogPhase,
  setDialogPhase,
  location,
  setLocation,
  addIssue
) => {
  const [title, setTitle] = useState(null);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState(null);
  const [images, setImages] = useState([]);
  const [agreement, setAgreement] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      [title, category, description, images, location, agreement].some(
        (x) => !x
      )
    ) {
      return;
    }

    const base64ImagePromises = iter(images).map((x) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(x);
      return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    const base64Images = await Promise.all(base64ImagePromises);

    const data = {
      title,
      category,
      description,
      images: base64Images,
      position: [location.lat, location.lng],
      progress: 'none'
    };

    setLocation(null);
    setTitle('');
    setCategory('');
    setDescription('');
    setImages([]);
    setAgreement(false);
    setDialogPhase(0);

    console.log(data);
    addIssue(data);
  };

  return (
    <div
      className={
        'absolute bg-white bottom-20 left-[calc(33.333%+1rem)] right-[calc(33.333%+1rem)] ' +
        'h-5/6 rounded-xl flex justify-center items-center ' +
        'transition-all  shadow-2xl ' +
        (dialogPhase % 2 === 1 ? 'z-[3000] opacity-100' : 'z-[-3000] opacity-0')
      }
    >
      <form>
        <div className='form-group mb-6'>
          <input
            type='text'
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            id='exampleInput90'
            placeholder='Nadpis'
            required
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group mb-6'>
          <select
            required
            value={category || 'null'}
            onChange={(e) => setCategory(e.target.value)}
            className='form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
            <option value='null'>Kategorie problému</option>
            <option value='roads'>Silnice</option>
            <option value='lights'>Osvětlení</option>
            <option value='trash'>Odpady</option>
          </select>
        </div>
        <div className='form-group mb-6'>
          <textarea
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            id='exampleInput91'
            placeholder='Popis problému'
            rows={5}
            required
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='form-group mb-6'>
          <label
            htmlFor='formFile'
            className='form-label inline-block mb-2 text-gray-700'
          >
            Fotografie problému
          </label>
          <input
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            type='file'
            id='formFile'
            accept='image/*'
            capture='environment'
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
        </div>
        <div className='form-group mb-6'>
          <button
            onClick={(e) => {
              e.preventDefault();
              setDialogPhase(2);
            }}
            className='w-full px-6 py-2.5 border-blue-600 border-[1px] text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
          >
            {location
              ? (
                  'Vybraná lokace'
                )
              : (
              <>
                <FontAwesomeIcon icon={faLocationDot} /> Lokace
              </>
                )}
          </button>
        </div>
        <div className='form-group form-check text-center mb-6'>
          <input
            type='checkbox'
            className='form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer'
            id='exampleCheck96'
            checked={agreement}
            onChange={(e) => setAgreement(e.target.checked)}
          />
          <label
            className='form-check-label inline-block text-gray-800'
            htmlFor='exampleCheck96'
          >
            Přečetl/a jsem si{' '}
            <a href='#' className='text-blue-600 hover:text-blue-800'>
              podmínky
            </a>
          </label>
        </div>
        <button
          onClick={(e) => onSubmit(e)}
          className='w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
        >
          Odeslat
        </button>
      </form>
    </div>
  );
};

const SuggestionDialog = (dialogOpen, setDialogOpen, addSuggestion) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [agreement, setAgreement] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if ([title, body, agreement].some((x) => !x)) {
      return;
    }

    const data = {
      title,
      body
    };

    setTitle('');
    setBody('');
    setAgreement(false);

    setDialogOpen(false);

    addSuggestion(data);
  };

  return (
    <div
      className={`absolute bg-white bottom-0 w-[100vw]
          h-2/3 rounded-t-xl flex justify-center right-0
          items-center transition-all  shadow-2xl
          ${dialogOpen ? 'z-[3000] opacity-100' : 'z-[-3000] opacity-0'}`}
    >
      <form className='w-5/6'>
        <div className='form-group mb-6'>
          <input
            type='text'
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            id='exampleInput90'
            placeholder='Nadpis'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group mb-6'>
          <textarea
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            id='exampleInput91'
            placeholder='Popis'
            rows={6}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className='form-group form-check text-center mb-6'>
          <input
            type='checkbox'
            className='form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer'
            id='exampleCheck96'
            checked={agreement}
            onChange={(e) => setAgreement(e.target.checked)}
          />
          <label
            className='form-check-label inline-block text-gray-800'
            htmlFor='exampleCheck96'
          >
            Přečetl/a jsem si{' '}
            <a href='#' className='text-blue-600 hover:text-blue-800'>
              podmínky
            </a>
          </label>
        </div>
        <button
          onClick={(e) => onSubmit(e)}
          className='w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
        >
          Odeslat
        </button>
      </form>
    </div>
  );
};

const markerDetailsComponent = (markerDetails) => {
  return (
    <>
      <div
        className={`bg-${
          data.colorMappings.category[markerDetails.category]
        }-400
             w-[100vw] h-5 z-[10000] -ml-6 rounded-t-xl`}
      />
      <h2 className='text-2xl py-2 px-2'>{markerDetails.title}</h2>
      <div className='px-2'>{markerDetails.description}</div>
      <div className='flex justify-center flex-col pt-2'>
        {markerDetails.images.map((image, i) => (
          <img className='my-4 mx-2 rounded-xl' src={image} key={i}></img>
        ))}
      </div>
    </>
  );
};
