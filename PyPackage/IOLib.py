import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
import seaborn as sns
import plotly.graph_objs as go
from yellowbrick.cluster import KElbowVisualizer
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


def generate_ids(path):
    """
    Creates a list of all IDs of the playlist from the excel file (input path to file). 
    :param path: str
    :return: list
    """
    df = pd.read_excel(path)

    id_list = []

    for i, j in df.iterrows():
        # in the excel file the link is in the 2nd column
        link = str(j[1])
        id = link.replace("https://open.spotify.com/playlist/", '')
        id = id[:id.find('?')]
        id_list.append(id)

    return id_list


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
    item_list = []
    curr = []
    # 100 by 100 add songs to the list
    offset = 0

    while True:
        # first iteration
        curr = spotify.playlist_items(playlist_id=playlist_id, offset=offset)['items']
        if len(curr) == 0:
            break
        item_list += curr
        offset += 100

    # create the final ID list
    while True:

        try:
            iD_list.append(item_list[i]['track']['id'])
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
            try:
                feat_dict = spotify.audio_features(trackID)
                coln = pd.DataFrame(feat_dict)
                coln.drop('analysis_url', axis=1, inplace=True)
                coln.drop('track_href', axis=1, inplace=True)
                coln.drop('uri', axis=1, inplace=True)
                coln.drop('type', axis=1, inplace=True)
                final_df = pd.concat([final_df, coln], ignore_index=True)
            # for songs that don't work
            except:
                continue

    final_df.set_index('id', inplace=True)
    # remove duplicates from the dataframe
    final_df.drop_duplicates(keep='last', inplace=True)
    return final_df


def merge_UserInput_with_SourceDF(user_df: pd.DataFrame, source_df: pd.DataFrame):
    """
    Reads the user feature dataset and merges that to the end of the source dataset. Removes the duplicates
    found in the source with the users dataset. It returns a tuple. first element is the merged dataset
    and the second is starting index of the user dataset.
    :param source_df: source dataframe
    :param user_df: user feature data frame
    :return: a tuple
    """
    start = source_df.index.size + 1
    # Merge the two datasets and remove the duplicates
    final_df = pd.concat([user_df, source_df])
    # remove the duplicates and keep the last
    final_df.drop_duplicates(inplace=True, keep='last')
    return final_df, start


def generate_csvFile_for_sourceData(feature_df):
    """
    reads the dataset as a dataframe and generates the data csv file
    :param feature_df:
    :return:
    """
    feature_df.to_csv('data.csv')
    return


def show_visualized_elbow(file_name=None, data_frame=None):
    """
    Given the data file/frame, it will show the elbow graph up to 40 iterations - Only one arg must be given.
    Its better to only use data frame since the data frame may be the mixed dataset in your case
    Use filename= or data_frame=
    :param data_frame: data frame instead of csv file
    :param file_name: csv file of the data
    :return: None -> shows the graph for the elbow method of the KMeans
    """
    if file_name is None:
        if data_frame is None:
            raise AssertionError("enter exactly One arg")
        else:
            cluster_df = data_frame.iloc[:, 1:]
    else:
        if data_frame is not None:
            raise AssertionError("Both args cant be given / only one please")
        else:
            cluster_df = pd.read_csv(file_name).iloc[:, 1:]

    # create kmean model to test and graph
    model = KMeans()
    # iterations up to 40
    visualizer = KElbowVisualizer(model, k=(1, 40))
    visualizer.fit(cluster_df)
    visualizer.show()


def elbow_test(file_name=None, data_frame=None):
    """
    Given the data file/frame, it will show the elbow graph up to 40 iterations - Only one arg must be given.
    Its better to only use data frame since the data frame may be the mixed dataset in your case
    Use filename= or data_frame=
    :param file_name: filename
    :param data_frame: dataframe which can be given or not
    :return: None -> shows the graph for the elbow method of the KMeans
    """
    if file_name is None:
        if data_frame is None:
            raise AssertionError("enter exactly One arg")
        else:
            cluster_df = data_frame.iloc[:, 1:]
    else:
        if data_frame is not None:
            raise AssertionError("Both args cant be given / only one please")
        else:
            cluster_df = pd.read_csv(file_name).iloc[:, 1:]

    Sum_of_squared_distances = []
    K = range(1, 40)
    for num_clusters in K:
        kmeans = KMeans(n_clusters=num_clusters)
        kmeans.fit(cluster_df)
        Sum_of_squared_distances.append(kmeans.inertia_)
    plt.plot(K, Sum_of_squared_distances, 'bx-')
    plt.xlabel('Values of K')
    plt.ylabel('Sum of squared distances/Inertia')
    plt.title('Elbow Method For Optimal k')
    plt.show()


def num_clusters(file_name=None, data_frame=None):
    """
    Given either the filename or the dataset, returns the number of the clusters that must be made.
    Its better to only use data frame since the data frame may be the mixed dataset in your case
    :param file_name: file name
    :param data_frame: dataset data frame
    :return: number of the clusters
    """
    if file_name is None:
        if data_frame is None:
            raise AssertionError("enter exactly One arg")
        else:
            cluster_df = data_frame.iloc[:, 1:]
    else:
        if data_frame is not None:
            raise AssertionError("Both args cant be given / only one please")
        else:
            cluster_df = pd.read_csv(file_name).iloc[:, 1:]

    model = KMeans()
    visualizer = KElbowVisualizer(model, k=(1, 40))
    visualizer.fit(cluster_df)
    return visualizer.elbow_value_


def create_cluster_for_mixed_data(num_clusters: int, dataframe: pd.DataFrame):
    """
    creates the cluster object for the KMeans and returns the object
    :param dataframe: the mixed dataframe
    :param num_clusters: number of the clusters as an integer
    :return: cluster object
    """
    kmeans = KMeans(n_clusters=num_clusters, n_init=200, max_iter=500, init='k-means++', algorithm="elkan")
    return kmeans.fit(dataframe)

"""
return a dictionary that maps each cluster number to a list of tuples
first element will be the id of the song from the user input in the same cluster
second element will be the index of that specific song in the main merged dataset.
HINT: the second element returned from the "merge_UserInput_with_SourceDF" function is the
starting index of the user input in the main dataset which can be used in the loops
necessary inputs: # of clusters + user data start index + mixed dataframe
lmk if we have to add more inputs. 
"""
######################################################################################

"""
a function that uses the returned list from the former function and checks + sorts
1st nearest neighbor to each point of users input from the source (in each cluster)
(from the source: means that the neihbors are chosen among merged_dataset[:startingIndexOfUserinput,:])
and computes the ratio of the songs in each cluster -> based on that, adds the first k nearest 
to the list of songs
using that info, it returns the top 50 songs.
"""
#######################################################################################

"""
a function that creates a spotify playlist using the API given the list of 50 track ids.
we have to add picture and disctiption to the playlist as well!
"""
