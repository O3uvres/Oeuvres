

class ClientError(Exception):
    def __init__(self, message, status_code=400):
        super(ClientError, self).__init__(message)
        self.message = message
        self.status_code = status_code

    def __str__(self):
        return self.message

    def __repr__(self):
        return self.message
