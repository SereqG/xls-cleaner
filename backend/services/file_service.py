import pandas as pd
import openpyxl
from typing import List, Dict, Any, Union
import io
from werkzeug.datastructures import FileStorage

from models.spreadsheet_info import SpreadsheetData, ColumnInfo

class FileService:
    
    def __init__(self):
        pass
    
    def get_status(self):
        return "File service ready"
    
    def analyze_xlsx_file(self, file: Union[FileStorage, str, bytes]) -> List[SpreadsheetData]:
        """
        Analyze an XLSX file and return spreadsheet information for all sheets.
        
        Args:
            file: Can be a FileStorage object, file path string, or bytes
            
        Returns:
            List of SpreadsheetData objects containing sheet info
        """
        try:
            if isinstance(file, FileStorage):
                file_content = file.read()
                file.seek(0)
                excel_file = pd.ExcelFile(io.BytesIO(file_content))
            elif isinstance(file, str):
                excel_file = pd.ExcelFile(file)
            elif isinstance(file, bytes):
                excel_file = pd.ExcelFile(io.BytesIO(file))
            else:
                raise ValueError("Unsupported file type")
            
            spreadsheet_data_list = []
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(excel_file, sheet_name=sheet_name, nrows=5)
                
                columns = []
                for col_name in df.columns:
                    col_type = self._determine_column_type(df[col_name])
                    columns.append(ColumnInfo(name=str(col_name), type=col_type))
                
                snippet = df.head(5).fillna("").to_dict('records')
                
                sheet_data = SpreadsheetData(
                    spreadsheet_name=sheet_name,
                    columns=columns,
                    spreadsheet_snippet=snippet
                )
                
                spreadsheet_data_list.append(sheet_data)
            
            return spreadsheet_data_list
            
        except Exception as e:
            raise Exception(f"Error analyzing XLSX file: {str(e)}")
    
    def _determine_column_type(self, series: pd.Series) -> str:
        """
        Determine the type of a pandas Series column.
        
        Args:
            series: Pandas Series to analyze
            
        Returns:
            String representation of the column type
        """
        non_null_series = series.dropna()
        
        if len(non_null_series) == 0:
            return "unknown"
        
        if pd.api.types.is_integer_dtype(series):
            return "integer"
        elif pd.api.types.is_float_dtype(series):
            return "float"
        elif pd.api.types.is_bool_dtype(series):
            return "boolean"
        elif pd.api.types.is_datetime64_any_dtype(series):
            return "datetime"
        else:
            sample_value = non_null_series.iloc[0]
            
            if isinstance(sample_value, (int, float)):
                return "number"
            elif isinstance(sample_value, bool):
                return "boolean"
            elif isinstance(sample_value, str):
                if self._is_date_string(sample_value):
                    return "date"
                elif self._is_numeric_string(sample_value):
                    return "numeric_string"
                else:
                    return "text"
            else:
                return "text"
    
    def _is_date_string(self, value: str) -> bool:
        """Check if a string represents a date."""
        try:
            pd.to_datetime(value)
            return True
        except:
            return False
    
    def _is_numeric_string(self, value: str) -> bool:
        """Check if a string represents a number."""
        try:
            float(value)
            return True
        except:
            return False