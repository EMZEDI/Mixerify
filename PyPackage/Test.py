from IOLib import *
import os
import sys

ACCESS_TOKEN = "BQCPs_EzyziVOtPy_Ziq0tYsP4kz3DmX9u2lsQDpmJ2ib0yTvJSTvEN6z_1_EokwbyHhKgTKCeCxpUGcqlXX0SP5saoCUeWQGRIUsuXFiauxO579eMHYmzrNIyFm7FKWJ1Srrc_y6yKfYvcRCwrYzhJxLoRSv2BmtRDRuTII5gXrIurIf8a_g2Z0uQb7tluWOGY74KbC4AGxPFi-i_LMfYgHiw"
# ACCESS_TOKEN = sys.argv[1]
# PLAYLIST_ID = sys.argv[2]

# spotify data

# client_id = os.environ.get('SPOTIPY_CLIENT_ID')
# client_secret = os.environ.get('SPOTIPY_CLIENT_SECRET')
REDIRECT_URI = "http://127.0.0.1:8000"  # this must be changed when the website is deployed

# # create the authentication and redirect the user to log in
# auth = spotipy.oauth2.SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=REDIRECT_URI,
#                                    scope="user-library-modify,playlist-modify-public")
# token_dict = auth.get_access_token()
sp = spotipy.Spotify(auth=ACCESS_TOKEN)
playlist = sp.user_playlist_create(sp.me()['id'], name="Personalized playlist AI")

# get the user entered playlist data
id = "3J4cvaaBSToZAqTNenBvD7"




user_df = create_feature_dataset([id], sp)
# read the main dataset to recommend the songs from
df = pd.read_pickle("../DATABASE/main.pkl")

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