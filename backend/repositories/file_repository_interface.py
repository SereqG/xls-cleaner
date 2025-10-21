from abc import ABC, abstractmethod

class FileRepositoryInterface(ABC):
    
    @abstractmethod
    def get_status(self) -> str:
        pass