import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sb

shahrad_ID = "b33beb1ef724488e945f7e3f3479dc21"
shahrad_secret = "7d94f50b42b549ba8d2fcd5ef31fc50e"

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

lz_uri = 'spotify:artist:36QJpDe2go2KgaRleHCDTp'
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(
    client_id=shahrad_ID,
    client_secret=shahrad_secret))

results = spotify.artist_top_tracks(lz_uri)
for track in results['tracks'][:10]:
    print('track : ' + track['name'])
    print('audio : ' + track['preview_url'])
    print('cover art: ' + track['album']['images'][0]['url'])
    print()
