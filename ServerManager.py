import github


class ServerManager:
    def __init__(self, token_file_path, database_path, images_path, branch, debug=False):
        self.token_file_path = token_file_path
        self.access_token = self.get_access_token()
        self.database_path = database_path
        self.images_path = images_path
        self.branch = branch
        self.debug = debug
        self.connected = False

    def get_access_token(self):
        with open(self.token_file_path, 'r') as file:
            return file.read()

    def connect(self):
        if self.connected:
            return

        try:
            if self.debug:
                github.enable_console_debug_logging()

            print("Connection avec le serveur GitHub...")
            # using an access token
            self.auth = github.Auth.Token(self.access_token)

            # Public Web Github
            self.g = github.Github(auth=self.auth)

            self.user = self.g.get_user()

            self.repo = self.user.get_repo("Oeuvres")
            print("Connection au serveur GitHub réalisée avec succès !")

            self.connected = True

        except Exception as e:
            raise ConnectionError("Impossible de se connecter au serveur GitHub : \n" + str(e)) from e

    def update_images(self, upload_manager, history_manager):
        self.connect()

        try:
            print("Mise à jour des images des oeuvres...")
            added_file_names, removed_file_names = history_manager.get_file_changes()
            contents = self.repo.get_contents(self.images_path)

            # On parcourt toutes les oeuvres du serveur pour trouver celles à supprimer
            # et vérifier qu'une ne contient pas le même nom qu'une des oeuvres qu'on va ajouter
            for content_file in contents:
                path = content_file.path
                file_name = upload_manager.get_file_name(path)
                if file_name in removed_file_names:
                    message = "Suppression de " + file_name + " par le logiciel administrateur."
                    print(message + "..")
                    self.repo.delete_file(path,  message, content_file.sha, branch=self.branch)
                    print(message[:-1] + " réalisée avec succès.")
                elif file_name in added_file_names:
                    print("ATTENTION ! Je sais pas pk mais un des fichiers qu'on ajoute à la même nom qu'un fichier"
                          "sur le serveur, donc on applique la procédure du changement de nom pour ce fichier.")
                    print("=== Super procédure de changement de nom que je n'ai pas encore fait ! ===")
                    print("(donc ça va pas marcher... mais aussi c'est parce que quelqu'un a touché au serveur ou"
                          "qu'il y a deux logiciels administrateurs.")

            for file_name in added_file_names:
                path = upload_manager.get_path(self.images_path, file_name)
                image_content = upload_manager.get_upload_as_bytes(file_name)
                message = "Ajout de " + file_name + " par le logiciel  administrateur."
                print(message + "..")
                self.repo.create_file(path, message, image_content, branch=self.branch)
                print(message[:-1] + " réalisé avec succès.")

            history_manager.commit()
            print("Mise à jour des images des oeuvres réalisée avec succès.")

        except Exception as e:
            raise DataBaseError("Erreur lors de la mise à jour de la base de données JSON : \n" + str(e)) from e

    def update_oeuvres(self, new_content):
        self.connect()

        try:
            print("Mise à jour de la base de données JSON...")

            # Récupération du fichier oeuvres.json
            oeuvres_contents = self.repo.get_contents(self.database_path)

            # Modification du fichier oeuvres.json
            message = "Mise à jour de la base de données par le logiciel administrateur."
            self.repo.update_file(oeuvres_contents.path, message,
                                  new_content, oeuvres_contents.sha, branch=self.branch)
            print(message[:-1] + " réalisée avec succès.")

        except Exception as e:
            raise UploadError("Erreur lors de la mise à jour des oeuvres : \n" + str(e)) from e


class ConnectionError(Exception):
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return "ConnectionError : " + self.message


class DataBaseError(Exception):
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return "DataBaseError : " + self.message


class UploadError(Exception):
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return "UploadError : " + self.message

