import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans


# YOUR spotify data
# ID = ""
# SECRET = ""
# spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(
#         client_id=ID,
#         client_secret=SECRET))


def run_spotifyForDev(client_id, client_secret):
    """
    Runs spotify for the developers. You have to enter your own id and secret
    :param client_id: id
    :param client_secret: secret
    :return: spotify
    """
    return spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(
        client_id=client_id,
        client_secret=client_secret))


def playlist_tracks_IDList_generator(playlist_id, spotify: spotipy.Spotify):
    """
    Gets a playlist ID & returns a list of all tracks IDs
    :param playlist_id: int
    :param spotify: Spotify
    :return: tracks_ID_List: list
    """
    # counter of the loop
    i: int = 0
    # Track ID list
    iD_list: list = []
    spot_Dict: dict = spotify.playlist_items(playlist_id=playlist_id)['items']
    while True:
        try:
            iD_list.append(spot_Dict[i]['track']['id'])
            i += 1
        except:
            break

    return iD_list


def create_feature_dataset(all_playlists_IDList: list, spotify: spotipy.Spotify):
    """
    read:
    :param all_playlists_IDList: List of all IDs for the total playlists
    :param spotify: Spotify
    :return: dataframe of all songs and their features collected from the whole input
    """
    final_df = pd.DataFrame({})
    # iterate thru each playlist and create rows of the final dataset and add to the dataframe to be returned
    for playlist_ID in all_playlists_IDList:

        # we have the playlist and have to create the list of tracks IDs of that specific playlist
        tracksIDs: list = playlist_tracks_IDList_generator(playlist_ID, spotify)
        # iterate thru the list of track IDs and generate each feature

        for trackID in tracksIDs:
            feat_dict = spotify.audio_features(trackID)
            coln = pd.DataFrame(feat_dict)
            coln.drop('analysis_url', axis=1, inplace=True)
            coln.drop('track_href', axis=1, inplace=True)
            coln.drop('uri', axis=1, inplace=True)
            coln.drop('type', axis=1, inplace=True)
            coln.set_index('id', inplace=True)
            final_df = final_df.append(coln, ignore_index=True)

    return final_df