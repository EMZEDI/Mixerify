from IOLib import *

# spotify data
client_id = 'b33beb1ef724488e945f7e3f3479dc21'
client_secret = '95d87eb49c204ec78c72852adf1855ad'
REDIRECT_URI = "http://127.0.0.1:8000"

# create the authentication and redirect the user to log in
auth = spotipy.oauth2.SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=REDIRECT_URI,
                                   scope="user-library-modify,playlist-modify-public")
token_dict = auth.get_access_token()
sp = spotipy.Spotify(auth_manager=auth)
playlist = sp.user_playlist_create(sp.me()['id'], name="Personalized playlist AI")

# get the user entered playlist data
user_init_playlistID = input("what is your input?")
id = user_init_playlistID.replace("https://open.spotify.com/playlist/", '')
id = id[:id.find('?')]
user_df = create_feature_dataset([id], sp)
# read the main dataset to recommend the songs from
df = pd.read_pickle("dataset.pkl")

# merge user and main dataset
output = merge_UserInput_with_SourceDF(user_df=user_df, source_df=df)
# normalize the output
norm = normalize_dataframe(output[0])
# get the number of the clusters
num = num_clusters(data_frame=norm)
model = create_cluster_for_mixed_data(num, norm)  # KMeans model
cluster_list = get_cluster_dataset(model, num, norm, output[1])  # dict of clusters of whole thing
cluster_user_list = get_cluster_user(model, num, norm, output[1])  # dict of clusters of only user

models = KNN_models(cluster_list, norm)  # KNN models

recs = generate_recommendations(models, cluster_user_list, norm, output[1])  # create recs

recs_id = generate_recommendation_ids(recs, cluster_list)  # generate the ids

final = []
links = [('http://open.spotify.com/track/' + id2) for id2 in recs_id]
for link in links:
    final.append(link)

sp.playlist_add_items(playlist["id"], final)
