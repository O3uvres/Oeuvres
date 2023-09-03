from github import Github, Auth, enable_console_debug_logging

acces_token = "A renseigner"
print("Activation du débuggage...")
enable_console_debug_logging()
print("Débuggage activée")

print("Authentification à GitHub ...")
# using an access token
auth = Auth.Token(acces_token)
print("auth :", auth)

# Public Web Github
g = Github(auth=auth)
print("g :", g)
print("Authentification réussie !")

user = g.get_user()
print("Utilisateur actuel : ", user.login)

print("Ouverture du repository Oeuvres...")
repo = user.get_repo("Oeuvres")
print("name :", repo.name)
print("topics :", repo.get_topics())
contents = repo.get_contents("")
print("contents :")
for content_file in contents:
    print(content_file)
print()

# Récupération du fichier oeuvres.json
oeuvres_contents = repo.get_contents("JSON/oeuvres.json")
print("Le fichier qui nous intéresse :", oeuvres_contents)
print("name :", oeuvres_contents.name)
print("path :", oeuvres_contents.path)
print("sha", oeuvres_contents.sha)

# Test de commit de création de fichier
print("Essai de création de fichier...")
commit = repo.create_file("bonjour.txt", "Test de création de fichier GitHub depuis un script python",
                          "Voici mon super fichier envoyé sur GitHub grâce à un script python !", branch="main")
print("YOUHOOOOOOUUUUUUU ! Création de fichier réussie !")
print(commit)

# Essai de modification du fichier oeuvres.json
print("Essai de modification de fichier...")
repo.update_file(oeuvres_contents.path, "more tests", "more tests", oeuvres_contents.sha, branch="main")
print("YOooooooooooooooooooUuuuuuuuuuuuuuuuuuHOOOOOOUUUUUUU ! Modification de fichier réussie !")
