import werkzeug.utils, os


class UploadManager:
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

    def __init__(self, upload_folder):
        self.upload_folder = upload_folder

    @staticmethod
    def get_extension(filename):
        return filename.rsplit('.', 1)[1].lower()

    @staticmethod
    def get_file_name(file_path):
        return file_path.rsplit("/", )[-1]

    @staticmethod
    def get_path(folder_path, file_name):
        return os.path.join(folder_path, file_name).replace("\\", "/")

    def get_upload_path(self, file_name):
        return self.get_path(self.upload_folder, file_name)

    def create_file_name(self, author, name, extension, incrementation=1):
        """ Fonction qui crée un nom de fichier pour une image en fonction de son nom et de l'auteur, qui
        respecte les conventions et que n'est pas déjà pris"""
        file_name = author + " " + name
        file_name = file_name.lower()
        file_name = werkzeug.utils.secure_filename(file_name)
        file_name = file_name.replace(".", "_")  # Au cas où pour ne pas avoir de double extension
        if incrementation > 1:
            file_name = file_name + "_" + str(incrementation)
        file_name = file_name + "." + extension
        file_name = werkzeug.utils.secure_filename(file_name)   # On revérifie que le nom de fichier est correcte

        if os.path.exists(self.get_upload_path(file_name)):  # Si le fichier existe alors on crée un nouveau nom de fichier
            return self.create_file_name(author, name, extension, incrementation + 1)
        else:
            return file_name

    def upload_artwork(self, name, author, file):
        if self.get_extension(file.filename) not in self.ALLOWED_EXTENSIONS:
            raise Exception(f"L'extension du fichier {file.filename} n'est pas autorisée.")

        file_name = self.create_file_name(author, name, self.get_extension(file.filename))

        upload_path = self.get_upload_path(file_name)
        file.save(upload_path)

        return upload_path

    def update_upload(self, last_file_name, name, author, new_file):
        self.delete_upload(last_file_name)
        return self.upload_artwork(name, author, new_file)

    def delete_upload(self, file_name):
        os.remove(self.get_upload_path(file_name))

    def get_upload_as_bytes(self, file_name):
        with open(self.get_upload_path(file_name), 'rb') as upload:
            upload_string = upload.read()
            upload_data = bytearray(upload_string)
            upload_bytes = bytes(upload_data)
            return upload_bytes
