import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import seaborn as sns
import plotly.graph_objs as go
from yellowbrick.cluster import KElbowVisualizer
from sklearn.cluster import KMeans
from sklearn.neighbors import NearestNeighbors
import pickle, math, time



# YOUR spotify data
'''
SPOTIPY_CLIENT_ID = ""
SECRET = ""
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(
       client_id=SPOTIPY_CLIENT_ID,
       client_secret=SECRET))
'''

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
    start = source_df.index.size

    # Merge the two datasets and remove the duplicates
    final_df = pd.concat([source_df, user_df])
    prev_size = final_df.index.size

    # remove the duplicates and keep the last
    final_df.drop_duplicates(inplace=True, keep='last')
    new_size = final_df.index.size
    start = start - (prev_size - new_size)
    return final_df, start

def normalize_dataframe(df: pd.DataFrame):
    """
    Normalizes the features in merged dataframe (manually)
    :param df: merged dataframe
    :return: merged dataframe normalized
    """
    scaler = MinMaxScaler()
    normalized = scaler.fit_transform(df)

    #reestablish pd dataframe (bc it is now an numpy array)
    normalized_df = pd.DataFrame(data=normalized, index=df.index, columns=df.columns)
    return normalized_df

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
    :param user_start_index: index where user songs are
    :param data_frame: data frame instead of csv file
    :param file_name: csv file of the data
    :return: None -> shows the graph for the elbow method of the KMeans
    """
    if file_name is None:
        if data_frame is None:
            raise AssertionError("enter exactly One arg")
        else:
            cluster_df = data_frame
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
            cluster_df = data_frame
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
            cluster_df = data_frame
    else:
        if data_frame is not None:
            raise AssertionError("Both args cant be given / only one please")
        else:
            cluster_df = pd.read_csv(file_name).iloc[:, 1:]

    model = KMeans()
    visualizer = KElbowVisualizer(model, k=(1, 40))
    visualizer.fit(cluster_df)
    return int(visualizer.elbow_value_)


def create_cluster_for_data(num_clusters: int, dataframe: pd.DataFrame):
    """
    creates the cluster object for the KMeans and returns the object
    :param dataframe: the mixed dataframe
    :param num_clusters: number of the clusters as an integer
    :return: cluster object
    """
    kmeans = KMeans(n_clusters=num_clusters, n_init=200, max_iter=500, init='k-means++', algorithm="elkan")
    return kmeans.fit(dataframe)


def get_cluster_dataset(model: KMeans, num_clusters: int, dataframe: pd.DataFrame):
    """
    returns a dict mapping a cluster number to all elements of that cluster
    :param model: KMeans model
    :param num_clusters: number of clusters
    :param dataframe: mixed dataframe
    :param user_start_index: index of first user song in mixed dataframe
    :return: list of clusters mapping to tuples of IDs and indices
    """
    d = {}
    for i in range(num_clusters):
        d[i] = []

    # list of clusters for each user song
    cluster = model.labels_

    for i in range(len(cluster)):
        #print(i)
        id = dataframe.index[i]
        d[cluster[i]].append((id, i))

    return d

def get_cluster_user(model: KMeans, num_clusters: int, dataframe: pd.DataFrame, user_start_index: int):
    """
    returns a dictionary that maps each cluster to a list of tuples
    the first element of the tuple is the ID of user_input
    songs in that cluster
    the second element is the index of the song in the dataset
    :param model: KMeans model object
    :param num_clusters: number of clusters as an integer
    :param dataframe: mixed dataframe
    :param user_start_index: index of first user song in mixed dataframe
    :return: dict mapping ints to a list of tuples
    """
    d = {}
    for i in range(num_clusters):
        d[i] = []

    #list of clusters for each user song
    cluster = model.predict(dataframe[user_start_index:])

    for i in range(len(cluster)):
        id = dataframe.index[i]
        d[cluster[i]].append((id, i+user_start_index))

    return d


def KNN_models(cluster_list: dict, dataframe: pd.DataFrame):
    """
    returns a list of NearestNeighbours model objects for each cluster
    :param cluster_list: dict mapping clusters to songs from dataset part of that cluster
    :param dataframe: dataset (w/o user songs)
    :return: dict that maps clusters to NearestNeighbours model
    """
    keys = [i for i in range(len(cluster_list))]
    models = dict.fromkeys(keys)

    for cluster in cluster_list:
        #we want all neighbors
        neigh = NearestNeighbors(n_neighbors=len(cluster_list[cluster]))
        indices = [index for id, index in cluster_list[cluster]]

        #dataframe with just rows of songs in the cluster
        model = neigh.fit(dataframe.iloc[indices, :].values)
        models[cluster] = model

    return models

def generate_recommendations(models: list, cluster_user_list: dict, dataframe: pd.DataFrame, user_start_index: int):
    """
    generates a list of 50 recommendations according to the first nearest neighbours
    to each song in the dict
    songs are tuples where the first element is the distance from the datapoint
    the second element is the index of the song relative to the prev function
    :param models: list of k NearestNeighbors models
    :param cluster_list: dictionary that maps cluster numbers to tuples of
    ids and indices of the user songs
    :param dataframe: mixed dataset
    :param user_start_index: index of first user song in mixed dataframe
    :return: dict mapping clusters to list of recommendations
    """
    neighbors = {}

    for i in range(len(cluster_user_list)):
        neighbors[i] = []

    #num user songs
    n = len(dataframe) - user_start_index

    recs_per_song = 1
    if n < 50:
        #find how many recs per song to find
        recs_per_song = math.ceil(50/n)

    for cluster in cluster_user_list:

        indices = [index for id, index in cluster_user_list[cluster]]
        songs_indices_added = []

        for idx in indices:
            for i in range(recs_per_song):

                pred = models[cluster].kneighbors([dataframe.iloc[idx]], return_distance=True)

                pred_tup = pred[0][0][i], pred[1][0][i]
                j = i + 1 # keeps track of the neighbor we look at

                #check for duplicates (duplicates within playlist accounted for by fct)
                while pred_tup[1] in songs_indices_added:
                    pred_tup = pred[0][0][j], pred[1][0][j]
                    j += 1

                neighbors[cluster].append(pred_tup)
                songs_indices_added.append(pred_tup[1])


    for cluster in neighbors:
        neighbors[cluster].sort()

        #check that this always outputs 50 songs
        if n < 50:
            songs_per_cluster = int(round((len(neighbors[cluster]) / (n*recs_per_song)) * 50, 0))
        else:
            songs_per_cluster = int(round((len(neighbors[cluster])/n)*50, 0))

        neighbors[cluster] = neighbors[cluster][:songs_per_cluster]

    return neighbors

def generate_recommendation_ids(rec_list: dict, cluster_dataset: dict):
    """
    generates a list of the recommendation IDs
    :param rec_list: dict mapping clusters to tuples of distances to indices
    :param cluster_dataset: dict mapping clusters to songs from dataset in that cluster
    :return: list of song IDs
    """
    recs_tup = [] #list of tuples of distance and ID

    for cluster in rec_list:
        for dist, index in rec_list[cluster]:
            recs_tup.append((dist, cluster_dataset[cluster][index][0]))
    recs_tup.sort()
    recs = [id for dist, id in recs_tup]

    return recs


def generate_csvFile_for_sourceData(feature_df):
    """
    reads the dataset as a dataframe and generates the data csv file
    :param feature_df:
    :return:
    """
    feature_df.to_csv('C:\\Users\\etomi\\Desktop\\Uni W2022\\MAIS202\\project\\data_norm.csv')
    return

def get_link_from_id(id: int):
    """
    returns the link to a specific song
    :param id: song id
    :return: link string
    """

    return 'http://open.spotify.com/track/' + str(id)

  
'''
TESTING STUFF
t1 = time.time()

#SPOTIFY STUFF

REDIRECT_URI = "http://127.0.0.1:8000"
scope = 'user-library-read'
client_credentials_manager = SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID, client_secret=SECRET)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
#sp = spotipy.Spotify(auth_manager=spotipy.SpotifyOAuth(scope=scope))
auth = spotipy.oauth2.SpotifyOAuth(client_id=SPOTIPY_CLIENT_ID, client_secret=SECRET, redirect_uri=REDIRECT_URI, scope="user-library-modify,playlist-modify-public")
token_dict = auth.get_access_token()
playlist = sp.user_playlist_create('31zy4fmqdtlr7txsbclu32cxbclm', 'Bonnie\'s new AI playlist')
#print('did Spotify thing')

#ML STUFF
#
#df = create_feature_dataset(['4bB4tur5SejOW9Nl7bM7tX'], sp)
#df.to_pickle("dataset.pkl")
df = pd.read_pickle("playlist_pkls//dataset.pkl")

#16Uj14Ek0EREN2NmKe8FOB
#https://open.spotify.com/playlist/3XL46hsF6P384x1Sr79CfF?si=9f396ff02b6b499a
user_df = create_feature_dataset(['3XL46hsF6P384x1Sr79CfF'], sp)
user_df.to_pickle("playlist_pkls//bonnie.pkl")
user_df = pd.read_pickle("playlist_pkls//bonnie.pkl") #classical music
#print("loaded data")

output = merge_UserInput_with_SourceDF(user_df, df) #not normalized output

#norm_df = normalize_dataframe(df) #normalized dataset only --> use so we can obtain the duplicates
#norm_df.to_pickle("model_pkls//norm_df.pkl")
norm_df = pd.read_pickle("model_pkls//norm_df.pkl")

norm_out = normalize_dataframe(output[0]) #normalized --> no store since we will use it later
#print("merged and normalized")

#num = num_clusters(data_frame=norm_df) #this is smtg we save
#print("num clusters:", num)

num = 7
#model = create_cluster_for_data(num, norm_df) #KMeans model to save, use norm_df to take all songs w/o duplicates
#pickle.dump(model, open( "kmeans.pkl", "wb" ))
model = pickle.load(open( "kmeans.pkl", "rb" ))
#print("created clusters")

#cluster_list = get_cluster_dataset(model, num, norm_df) #dict of clusters of whole thing
#pickle.dump(cluster_list, open( "cluster_list.pkl", "wb" ))
cluster_list = pickle.load(open( "cluster_list.pkl", "rb" ))
cluster_user_list = get_cluster_user(model, num, norm_out, output[1]) #dict of clusters of only user --> should we use the norm_user instead of merged?
#print("got cluster list")

#models = KNN_models(cluster_list, norm_df) #KNN models using only dataset songs
#pickle.dump(models, open( "knn.pkl", "wb" ))
models = pickle.load(open( "knn.pkl", "rb" ))
#print("made KNN models")

recs = generate_recommendations(models, cluster_user_list, norm_out, output[1])

recs_id = generate_recommendation_ids(recs, cluster_list)


#add to playlist
sp.playlist_add_items(playlist["id"], recs_id)

#print("done!")

t2 = time.time()

print("runtime: ", t2-t1)
'''
