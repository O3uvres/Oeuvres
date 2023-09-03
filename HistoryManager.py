import datetime


class HistoryManager:
    def __init__(self, history_file_path):
        self.history_file_path = history_file_path

    @staticmethod
    def get_str_datetime():
        now = datetime.datetime.now()
        # dd/mm/YY_H:M:S
        dt_string = now.strftime("%d/%m/%Y-%H:%M:%S")
        return dt_string

    def add(self, url_name, file_name):
        with open(self.history_file_path, 'a') as file:
            line = "\n" + self.get_str_datetime() + " ADD " + url_name + " " + file_name
            file.write(line)

    def edit(self, url_name, removed_file_name="", added_file_name=""):
        with open(self.history_file_path, 'a') as file:
            line = "\n" + self.get_str_datetime() + " EDIT " + url_name + " " + \
                   removed_file_name + " " + added_file_name
            file.write(line)

    def remove(self, url_name, file_name):
        with open(self.history_file_path, 'a') as file:
            line = "\n" + self.get_str_datetime() + " REMOVE " + url_name + " " + file_name
            file.write(line)

    def commit(self):
        with open(self.history_file_path, 'a') as file:
            line = "\n" + self.get_str_datetime() + " COMMIT"
            file.write(line)

    @staticmethod
    def read_line(line):
        line = line.rstrip('\n')
        values = line.split(" ")
        values = [x for x in values if x != '']  # On supprime toutes les valeurs nulles
        if len(values) < 2:  # S'il y a moins de deux mots on ne peut lire le changement
            action = "NONE"
            change = {}
        else:
            change = {"datetime": values[0]}
            action = values[1]
            if action == "ADD":
                change["url_name"] = values[2]
                change["added_file_name"] = values[3]
            elif action == "EDIT":
                change["url_name"] = values[2]
                if len(values) > 3:  # S'il y a un nom de fichier
                    change["removed_file_name"] = values[3]
                    change["added_file_name"] = values[4]
            elif action == "REMOVE":
                change["url_name"] = values[2]
                change["removed_file_name"] = values[3]
            elif action == "COMMIT":
                pass
            else:
                # On ne reconnait pas l'action
                action = "NONE"
                change = {}
        return action, change

    def get_file_changes(self):
        """ Fonction qui renvoie les fichiers créés et supprimés depuis le dernier commit"""

        # On récupère d'abord tous les changements depuis le dernier commit
        added_file_names, removed_file_names = [], []
        with open(self.history_file_path, 'r') as file:
            for line in file.readlines():
                action, change = self.read_line(line)
                if action == "COMMIT":
                    added_file_names, removed_file_names = [], []
                elif action == "ADD":
                    added_file_names.append(change["added_file_name"])
                elif action == "EDIT" and "removed_file_name" in change and "added_file_name" in change:
                    file_name = change["removed_file_name"]
                    if file_name in added_file_names:
                        added_file_names.remove(file_name)
                    else:
                        removed_file_names.append(file_name)
                    added_file_names.append(change["added_file_name"])
                elif action == "REMOVE":
                    file_name = change["removed_file_name"]
                    if file_name in added_file_names:
                        added_file_names.remove(file_name)
                    else:
                        removed_file_names.append(file_name)

        return added_file_names, removed_file_names




