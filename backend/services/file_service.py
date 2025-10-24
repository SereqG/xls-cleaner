import pandas as pd
import numpy as np
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
                
                # Convert DataFrame to records and ensure JSON serializable types
                snippet_raw = df.head(5).fillna("").to_dict('records')
                snippet = self._make_json_serializable(snippet_raw)
                
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
    
    def _make_json_serializable(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Convert pandas/numpy data types to JSON serializable Python types.
        
        Args:
            data: List of dictionaries that may contain pandas/numpy types
            
        Returns:
            List of dictionaries with JSON serializable values
        """
        
        
        serializable_data = []
        
        for record in data:
            serializable_record = {}
            
            for key, value in record.items():
                if pd.isna(value) or value is pd.NaT:
                    serializable_record[key] = None
                elif isinstance(value, (np.integer, np.floating)):
                    serializable_record[key] = value.item()
                elif isinstance(value, np.bool_):
                    serializable_record[key] = bool(value)
                elif isinstance(value, (pd.Timestamp, np.datetime64)):
                    serializable_record[key] = str(value)
                else:
                    serializable_record[key] = value
                    
            serializable_data.append(serializable_record)
            
        return serializable_data