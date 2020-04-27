import * as React from "react"
import * as ReactDOM from "react-dom"

import "../styles/popup.css"
import useDebounce from "./popup/useDebounce";

const ROOM_CODE_KEY = 'roomCode'

const Popup: React.FC = () => {
	const [roomCode, setRoomCode] = React.useState<string | null>(null);
	const debouncedRoomCode = useDebounce(roomCode, 700);

	React.useEffect(() => {
		new Promise<string | null>(resolve => chrome.storage.sync.get([ROOM_CODE_KEY], data => resolve(data[ROOM_CODE_KEY])))
			.then(fetchedRoomCode => fetchedRoomCode && setRoomCode(fetchedRoomCode));
	}, []);

	React.useEffect(() => {
		if (debouncedRoomCode === null) return;
		chrome.storage.sync.set({ [ROOM_CODE_KEY]: debouncedRoomCode });
	}, [debouncedRoomCode]);

	return (
		<div className="popup-padded">
			<h1>JWPlayer Sync</h1>
			<span>Room Code:</span> <input value={roomCode ?? ''} onChange={e => setRoomCode(e.target.value)} />
			{/* <h1>{ chrome.i18n.getMessage("l10nHello") }</h1> */}
		</div>
	)
}

// --------------

ReactDOM.render(
	<Popup />,
	document.getElementById('root')
)