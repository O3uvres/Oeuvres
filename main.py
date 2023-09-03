from flask import Flask, request, render_template, redirect, make_response

from ItemManager import ItemManager
from UploadManager import UploadManager
from ServerManager import ServerManager
from HistoryManager import HistoryManager
from ClientError import ClientError

import webbrowser


DEBUG = False
# ======== Chargement de la base de données JSON des oeuvres =================
ITEM_FOLDER_PATH = "data"
ITEM_FILE_PATH = "data/oeuvres.json"
UPLOAD_FOLDER = "static/OEUVRES"
HISTORY_FILE_PATH = "logs/history.txt"

ACCESS_TOKEN_FILE_PATH = "access_token.txt"
SERVER_DATABASE_PATH = "JSON/oeuvres.json"
SERVER_OEUVRES_PATH = "PICTURES/OEUVRES"
SERVER_BRANCH = "main"


itemManager = ItemManager(ITEM_FILE_PATH, ITEM_FOLDER_PATH)
uploadManager = UploadManager(UPLOAD_FOLDER)
serverManager = ServerManager(ACCESS_TOKEN_FILE_PATH, SERVER_DATABASE_PATH, SERVER_OEUVRES_PATH, SERVER_BRANCH)
historyManager = HistoryManager(HISTORY_FILE_PATH)


# ================ Mise en place de l'API / du serveur ======================
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/catalogue")
def catalogue():
    return render_template("catalogue.html")


@app.route("/oeuvres")
def get_oeuvres():
    return itemManager.read_json()


@app.route("/propos")
def propos():
    return render_template("propos.html")


def verify_request_attributes(required_attributes):
    for attribute in required_attributes:
        if attribute not in request.form:
            message = "Requête incomplète : il manque l'attribut \"" + attribute + "\"."
            raise ClientError(message, 400)


def verify_post_request(action):
    if action == "ADD":
        # check if the post request has the file part
        if 'file' not in request.files:
            raise ClientError("No file part", 417)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '' or not file:
            raise ClientError("No selected file", 417)  # Je suis pas sur que c'est le bon code/status

        # Maintenant qu'on sait qu'il y a bien un fichier, on regarde s'il y a tous les attributs nécessaires
        verify_request_attributes(["name", "author", "materiau et support", "dimensions", "date",
                                   "lieu de conservation", "representation", "image",
                                   "materialite", "presentation", "processus"])

    elif action == "EDIT" or action == "DELETE":
        verify_request_attributes(["item"])

        # L'url de l'oeuvre doit exister :
        if request.form["item"] not in itemManager.itemsByUrl:
            raise ClientError(f"Impossible de modifier l'oeuvre : l'url \"{request.form['item']}\""
                              f" ne renvoie vers aucune d'entre elles.")


@app.route("/add", methods=['GET', 'POST'])
def add():
    if request.method == 'GET':
        return render_template("add.html")
    else:
        try:
            verify_post_request("ADD")
            file = request.files['file']
            itemManager.save_item(request.form["name"], request.form["author"], request.form, file,
                                       uploadManager, historyManager)
            print("L'oeuvre a été ajoutée avec succés !")
            return make_response(redirect("/add"), 200)
        except ClientError as e:
            print(e)
            return make_response(redirect(request.referrer), e.status_code)
        except Exception as e:
            print("Erreur lors de l'ajout de l'oeuvre.")
            if DEBUG:
                raise e
            else:
                print(e)
                return make_response(redirect(request.referrer), 500)


@app.route("/edit", methods=["GET", "POST"])
def edit():
    if request.method == "GET":
        return render_template("edit.html")
    else:
        file = None
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '' or not file:
                file = None
        try:
            verify_post_request("EDIT")
            itemManager.edit_item(request.form["item"], request.form, uploadManager, historyManager, file)
            print("L'oeuvre a été modifiée avec succés !")
            return make_response(redirect("/oeuvres/" + request.form["item"]), 200)
        except ClientError as e:
            print(e)
            return make_response(redirect(request.referrer), 400)
        except Exception as e:
            print("Erreur lors de la modification de l'oeuvre.")
            if DEBUG:
                raise e
            else:
                print(e)
                return make_response(redirect(request.referrer), 500)


@app.route("/delete", methods=["POST"])
def delete():
    try:
        verify_post_request("DELETE")
        itemManager.delete_item(request.form["item"], uploadManager, historyManager)
        print("L'oeuvre a été supprimée avec succès !")
        return make_response(redirect("/catalogue"), 200)
    except ClientError as e:
        print(e)
        return make_response(redirect(request.referrer), 400)
    except Exception as e:
        print("Erreur lors de la suppression de l'oeuvre.")
        if DEBUG:
            raise e
        else:
            print(e)
            return make_response(redirect(request.referrer), 500)


@app.route("/oeuvres/<urlname>")
def oeuvre(urlname):
    return render_template("oeuvre.html")


@app.route("/oeuvres/<urlname>/json")
def get_oeuvre(urlname):
    return itemManager.item_to_json(itemManager.get_item(urlname))


@app.route("/commit", methods=["POST"])
def commit():
    try:
        serverManager.update_images(uploadManager, historyManager)
        serverManager.update_oeuvres(itemManager.create_server_json(SERVER_OEUVRES_PATH))

        print("Serveur mis à jour avec succès !")
        return make_response(redirect(request.referrer), 200)
    except Exception as e:
        print("Erreur lors de la mise à jour du serveur.")
        if DEBUG:
            raise e
        else:
            print(e)
            return make_response(redirect(request.referrer), 500)


@app.route("/header")
def header():
    with open("templates/header.html") as file:
        return file.read()


@app.route("/footer")
def footer():
    with open("templates/footer.html") as file:
        return file.read()


if __name__ == "__main__":
    webbrowser.open("http://127.0.0.1:5000")
    app.run(debug=DEBUG)
