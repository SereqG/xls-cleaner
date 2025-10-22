from dataclasses import dataclass
from typing import List, Any, Dict

@dataclass
class ColumnInfo:
    name: str
    type: str

@dataclass
class SpreadsheetData:
    spreadsheet_name: str
    columns: List[ColumnInfo]
    spreadsheet_snippet: List[Dict[str, Any]]
    
    def to_dict(self):
        return {
            'spreadsheet_name': self.spreadsheet_name,
            'columns': [{'name': col.name, 'type': col.type} for col in self.columns],
            'spreadsheet_snippet': self.spreadsheet_snippet
        }
