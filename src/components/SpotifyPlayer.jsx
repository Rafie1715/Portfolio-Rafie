import { useEffect, useState, useRef } from 'react';

export default function SpotifyPlayer() {
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const tokenRef = useRef(null);

  useEffect(() => {
    let player;

    const loadToken = async () => {
      try {
        const res = await fetch('/.netlify/functions/spotify-auth');
        const json = await res.json();
        tokenRef.current = json.access_token;
        return json.access_token;
      } catch (err) {
        console.error('Failed to get spotify token', err);
        return null;
      }
    };

    const setupPlayer = async () => {
      const token = await loadToken();
      if (!token) return;

      const existing = window.Spotify;
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        const accessToken = tokenRef.current;
        player = new window.Spotify.Player({
          name: 'Rafie Web Player',
          getOAuthToken: (cb) => { cb(accessToken); },
        });

        player.addListener('ready', ({ device_id }) => {
          setDeviceId(device_id);
          setIsReady(true);
          console.log('Spotify Player ready with device id', device_id);
        });

        player.addListener('player_state_changed', (state) => {
          if (!state) return;
          setIsPaused(state.paused);
        });

        player.connect();

        // expose helper to window to play track via Web API and device id
        window.spotifyPlayerPlay = async (spotifyUri) => {
          try {
            // refresh token if needed
            const authRes = await fetch('/.netlify/functions/spotify-auth');
            const authJson = await authRes.json();
            const access_token = authJson.access_token;

            // transfer playback to our device
            if (!deviceId) {
              // wait until deviceId ready
              let attempts = 0;
              while (!deviceId && attempts < 10) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise((r) => setTimeout(r, 300));
                attempts += 1;
              }
            }

            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
              method: 'PUT',
              headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ uris: [spotifyUri] }),
            });

            return true;
          } catch (err) {
            console.error('spotifyPlayerPlay error', err);
            return false;
          }
        };
      };
    };

    setupPlayer();

    return () => {
      if (player) player.disconnect();
      // cleanup global
      if (window.spotifyPlayerPlay) delete window.spotifyPlayerPlay;
    };
  }, [deviceId]);

  if (!isReady) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900/80 text-white rounded-xl p-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-sm">Web Player Active</div>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/.netlify/functions/spotify-auth');
                const { access_token } = await res.json();
                await fetch('https://api.spotify.com/v1/me/player/pause', { method: 'PUT', headers: { Authorization: `Bearer ${access_token}` } });
                setIsPaused(true);
              } catch (err) {
                console.error(err);
              }
            }}
            className="ml-2 px-2 py-1 bg-white/10 rounded text-xs"
          >
            Pause
          </button>
        </div>
      </div>
    </div>
  );
}
