from IOLib import *
import os
import sys

# take in user access token and playlist ID from args
TOKEN = sys.argv[1]
ID = sys.argv[2]
URL_MODIFIER = "../../PyPackage/"

# setup spotify
sp = spotipy.Spotify(auth=TOKEN)
current = sp.playlist(ID)['name']

# create new playlist
playlist = sp.user_playlist_create(sp.me()['id'], name=current + " AI Remix")
print(playlist['id'], end="")
# print("created the playlist for the user init")

#### ml stuff ####

df = pd.read_pickle(URL_MODIFIER + "dataset.pkl")
# print("read the main data")

user_df = create_feature_dataset([ID], sp)
user_df.to_pickle(URL_MODIFIER + "user.pkl")
# print("read the user data")

user_df = pd.read_pickle(URL_MODIFIER + "user.pkl")
# print("loaded data")

output = merge_UserInput_with_SourceDF(user_df, df)
norm_out = normalize_dataframe(output[0])
# print("merged and normalized")

num = num_clusters(data_frame=norm_out)
# print("num clusters:", num)
model = create_cluster_for_mixed_data(num, norm_out)  # KMeans model
# print("created clusters")
cluster_list = get_cluster_dataset(model, num, norm_out, output[1])  # dict of clusters of whole thing
cluster_user_list = get_cluster_user(model, num, norm_out, output[1])  # dict of clusters of only user
# print("got cluster list")
models = KNN_models(cluster_list, norm_out[:output[1]])  # KNN models
# print("made KNN models")
recs = generate_recommendations(models, cluster_user_list, norm_out, output[1])
# print(recs)

recs_id = generate_recommendation_ids(recs, cluster_list)
# print(recs_id)
# print(len(recs_id))

# add to playlist
sp.playlist_add_items(playlist["id"], recs_id)
