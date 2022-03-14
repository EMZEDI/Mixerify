from IOLib import *
import os
import sys

# ACCESS_TOKEN = "BQCPs_EzyziVOtPy_Ziq0tYsP4kz3DmX9u2lsQDpmJ2ib0yTvJSTvEN6z_1_EokwbyHhKgTKCeCxpUGcqlXX0SP5saoCUeWQGRIUsuXFiauxO579eMHYmzrNIyFm7FKWJ1Srrc_y6yKfYvcRCwrYzhJxLoRSv2BmtRDRuTII5gXrIurIf8a_g2Z0uQb7tluWOGY74KbC4AGxPFi-i_LMfYgHiw"
TOKEN = sys.argv[1]
ID = sys.argv[2]
URL_MODIFIER="../../PyPackage/"
# print(ID)
# print("-----")
# print(TOKEN)

# spotify data

# client_id = os.environ.get('SPOTIPY_CLIENT_ID')
# client_secret = os.environ.get('SPOTIPY_CLIENT_SECRET')
# REDIRECT_URI = "http://127.0.0.1:8000"  # this must be changed when the website is deployed

# # create the authentication and redirect the user to log in
# auth = spotipy.oauth2.SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=REDIRECT_URI,
#                                    scope="user-library-modify,playlist-modify-public")
# token_dict = auth.get_access_token()
# sp = spotipy.Spotify(auth=ACCESS_TOKEN)
# playlist = sp.user_playlist_create(sp.me()['id'], name="Personalized playlist AI")

# get the user entered playlist data
# id = "3J4cvaaBSToZAqTNenBvD7"



# TOKEN = "BQAzs-C6Mk7uCrYi60pNqNI43bToxOcIpib_HXHKJFLZByktPYHTooIvQzp1-XzKGOj1nxhsRSS_d9oUzgNWlCgaobLxtFEDB9sASWvdE36KujUSTbnEe2xaUCOWiMJEEacuDhANL5I33EixtL4y40Fr887GcrBBXwRzGBJgj-Rjk_TM48sMRUGo9kABkMN4IdWHPkhegMEu4Z9KPenx1QKtQg"  # enter your token here + make sure its not expired
# ID = "3J4cvaaBSToZAqTNenBvD7"  # enter your playlist ID here

sp = spotipy.Spotify(auth=TOKEN)
current = sp.playlist(ID)['name']

playlist = sp.user_playlist_create(sp.me()['id'], name=current+" AI Remix")
print(playlist['id'],end="")
# print("created the playlist for the user init")

df = pd.read_pickle(URL_MODIFIER+"dataset.pkl")
# print("read the main data")

user_df = create_feature_dataset([ID], sp)
user_df.to_pickle(URL_MODIFIER+"user.pkl")
# print("read the user data")

user_df = pd.read_pickle(URL_MODIFIER+"user.pkl")
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
models = KNN_models(cluster_list, norm_out)  # KNN models
# print("made KNN models")
recs = generate_recommendations(models, cluster_user_list, norm_out, output[1])
# print(recs)

recs_id = generate_recommendation_ids(recs, cluster_list)
# print(recs_id)
# print(len(recs_id))

# add to playlist
sp.playlist_add_items(playlist["id"], recs_id)