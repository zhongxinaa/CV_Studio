class AIConfigurationError(Exception):
    pass


class AIProviderError(Exception):
    def __init__(self, message: str, provider: str, cause: Exception | None = None):
        super().__init__(message)
        self.provider = provider
        self.cause = cause
